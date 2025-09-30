"use server";
import { auth } from "~/lib/auth";
import { oneTimePurchase } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "~/server/db";

export type PurchaseDetails = {
  id: string;
  productId: string;
  status: string;
  totalAmount: number;
  currency: string;
  paid: boolean;
  refundedAmount: number | null;
  refundedTaxAmount: number | null;
  isInvoiceGenerated: boolean | null;
  organizationId: string | null;
};

export type PurchaseDetailsResult = {
  hasPurchased: boolean;
  purchase?: PurchaseDetails;
  error?: string;
  errorType?: "REFUNDED" | "PENDING" | "GENERAL";
};

export async function getPurchaseDetails(): Promise<PurchaseDetailsResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { hasPurchased: false };
    }

    const userPurchases = await db
      .select()
      .from(oneTimePurchase)
      .where(eq(oneTimePurchase.userId, session.user.id));

    // console.log("Found user purchase:", userPurchases);

    if (!userPurchases.length) {
      console.log("No purchases found for user");
      return { hasPurchased: false };
    }

    // Get the most recent active purchase
    const activePurchase = userPurchases
      .filter((sub) => sub.status === "paid" )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    if (activePurchase) {      
      // Validate that the subscription has valid dates
      if (!activePurchase.paid) {
        console.warn("Active Purchase has invalid dates:", activePurchase);
        return {
          hasPurchased: false,
          error: "Invalid subscription data",
          errorType: "GENERAL",
        };
      }
  

      // Normal active purchase 
      return {
        hasPurchased: true,
        purchase: {
          id: activePurchase.id,
          productId: activePurchase.productId,
          status: activePurchase.status,
          totalAmount: activePurchase.totalAmount,
          currency: activePurchase.currency,
          paid: activePurchase.paid,
          refundedAmount: activePurchase.refundedAmount,
          refundedTaxAmount: activePurchase.refundedTaxAmount,
          isInvoiceGenerated: activePurchase.isInvoiceGenerated,
          organizationId: null,
        },
      };
    }

    // Fallback: no active purchase, check for latest purchase (refunded)
    const latestPurchase = userPurchases.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    if (latestPurchase) {
      
      // Validate that the purchase has valid dates
      if (!latestPurchase.paid) {
        console.warn("Latest subscription has invalid dates:", latestPurchase);
        return {
          hasPurchased: false,
          error: "Invalid subscription data",
          errorType: "GENERAL",
        };
      }
      
      const isRefunded = latestPurchase.status === "refunded";

      return {
        hasPurchased: true,
        purchase: {
          id: latestPurchase.id,
          productId: latestPurchase.productId,
          status: latestPurchase.status,
          totalAmount: latestPurchase.totalAmount,
          currency: latestPurchase.currency,
          paid: latestPurchase.paid,
          refundedAmount: latestPurchase.refundedAmount,
          refundedTaxAmount: latestPurchase.refundedTaxAmount,
          isInvoiceGenerated: latestPurchase.isInvoiceGenerated,
          organizationId: null,
        },
        error: isRefunded ? "Purchase has been refunded" : "Purchase is not active",
        errorType: isRefunded ? "REFUNDED" : "GENERAL",
      };
    }
    return { hasPurchased: false };

  } catch (error) {
    console.error("Error fetching purchase details:", error);
    return {
      hasPurchased: false,
      error: "Failed to load purchase details",
      errorType: "GENERAL",
    };
  }

}

export async function hasUserPurchased(): Promise<boolean> {
  const result = await getPurchaseDetails();
  return result.hasPurchased && result.purchase?.paid === true;
}

export async function hasAccessToProduct(productId: string): Promise<boolean> {
  const result = await getPurchaseDetails();
  if (!result.hasPurchased || !result.purchase) {
    return false;
  }

  const isValidPurchase = result.purchase.paid && 
                         result.purchase.status === "paid" &&
                         (result.purchase.refundedAmount ?? 0) < result.purchase.totalAmount;

  return isValidPurchase && result.purchase.productId === productId;
}


export async function getUserPurchaseStatus():Promise< "paid" | "refunded" | "pending" | "none"> {

  const result = await getPurchaseDetails();
  
  if(!result.purchase) {
    return "none"
  }
  
  if (result.purchase.status === "paid" && result.purchase.paid) {
    return "paid"
  }

  if (!result.purchase.paid || result.purchase.status === "pending") {
    return "pending"
  }

  if (result.purchase.status === "refunded" || (result.purchase.refundedAmount ?? 0) >= result.purchase.totalAmount) {
    return "refunded"
  }

  return "none";
}