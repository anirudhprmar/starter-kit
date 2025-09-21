"use server";
import { auth } from "~/lib/auth";
import { subscription } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "~/server/db";

export type SubscriptionDetails = {
  id: string;
  productId: string;
  status: string;
  amount: number;
  currency: string;
  recurringInterval: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  canceledAt: Date | null;
  organizationId: string | null;
};

export type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: "CANCELED" | "EXPIRED" | "GENERAL";
};

export async function getSubscriptionDetails(): Promise<SubscriptionDetailsResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { hasSubscription: false };
    }

    const userSubscriptions = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, session.user.id));

    // console.log("Found user subscriptions:", userSubscriptions);

    if (!userSubscriptions.length) {
      console.log("No subscriptions found for user");
      return { hasSubscription: false };
    }

    // Get the most recent active subscription
    const activeSubscription = userSubscriptions
      .filter((sub) => sub.status === "active")
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

    if (activeSubscription) {
      const now = new Date();
      
      // Validate that the subscription has valid dates
      if (!activeSubscription.currentPeriodStart || !activeSubscription.currentPeriodEnd) {
        console.warn("Active subscription has invalid dates:", activeSubscription);
        return {
          hasSubscription: false,
          error: "Invalid subscription data",
          errorType: "GENERAL",
        };
      }
      
      const isInGracePeriod = 
        activeSubscription.cancelAtPeriodEnd === true &&
        new Date(activeSubscription.currentPeriodEnd) > now;

      // Grace period: active, cancelAtPeriodEnd true, currentPeriodEnd in future
      if (isInGracePeriod) {
        return {
          hasSubscription: true,
          subscription: {
            id: activeSubscription.id,
            productId: activeSubscription.productId,
            status: activeSubscription.status,
            amount: activeSubscription.amount,
            currency: activeSubscription.currency,
            recurringInterval: activeSubscription.recurringInterval,
            currentPeriodStart: activeSubscription.currentPeriodStart,
            currentPeriodEnd: activeSubscription.currentPeriodEnd,
            cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd,
            canceledAt: activeSubscription.canceledAt,
            organizationId: null,
          },
          error:
            "Subscription will end on " +
            new Date(activeSubscription.currentPeriodEnd).toLocaleDateString(),
          errorType: "CANCELED",
        };
      }

      // Normal active subscription (not in grace period)
      return {
        hasSubscription: true,
        subscription: {
          id: activeSubscription.id,
          productId: activeSubscription.productId,
          status: activeSubscription.status,
          amount: activeSubscription.amount,
          currency: activeSubscription.currency,
          recurringInterval: activeSubscription.recurringInterval,
          currentPeriodStart: activeSubscription.currentPeriodStart,
          currentPeriodEnd: activeSubscription.currentPeriodEnd,
          cancelAtPeriodEnd: activeSubscription.cancelAtPeriodEnd,
          canceledAt: activeSubscription.canceledAt,
          organizationId: null,
        },
      };
    }

    // Fallback: no active subscription, check for latest subscription (canceled/expired)
    const latestSubscription = userSubscriptions.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )[0];

    if (latestSubscription) {
      const now = new Date();
      
      // Validate that the subscription has valid dates
      if (!latestSubscription.currentPeriodStart || !latestSubscription.currentPeriodEnd) {
        console.warn("Latest subscription has invalid dates:", latestSubscription);
        return {
          hasSubscription: false,
          error: "Invalid subscription data",
          errorType: "GENERAL",
        };
      }
      
      const isExpired = new Date(latestSubscription.currentPeriodEnd) < now;
      const isCanceled = latestSubscription.status === "canceled";

      return {
        hasSubscription: true,
        subscription: {
          id: latestSubscription.id,
          productId: latestSubscription.productId,
          status: latestSubscription.status,
          amount: latestSubscription.amount,
          currency: latestSubscription.currency,
          recurringInterval: latestSubscription.recurringInterval,
          currentPeriodStart: latestSubscription.currentPeriodStart,
          currentPeriodEnd: latestSubscription.currentPeriodEnd,
          cancelAtPeriodEnd: latestSubscription.cancelAtPeriodEnd,
          canceledAt: latestSubscription.canceledAt,
          organizationId: null,
        },
        error: isCanceled
          ? "Subscription has been canceled"
          : isExpired
            ? "Subscription has expired"
            : "Subscription is not active",
        errorType: isCanceled ? "CANCELED" : isExpired ? "EXPIRED" : "GENERAL",
      };
    }
    
    return { hasSubscription: false };

  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return {
      hasSubscription: false,
      error: "Failed to load subscription details",
      errorType: "GENERAL",
    };
  }
}

// Simple helper to check if user has an active subscription
export async function isUserSubscribed(): Promise<boolean> {
  const result = await getSubscriptionDetails();
  if (!result.hasSubscription || !result.subscription) {
    return false;
  }

  const now = new Date();
  // Subscription is active and not canceled
  if (
    result.subscription.status === "active" &&
    !result.subscription.cancelAtPeriodEnd
  ) {
    return true;
  }

  // Subscription is in grace period (active but will cancel at period end)
  if (
    result.subscription.status === "active" &&
    result.subscription.cancelAtPeriodEnd &&
    new Date(result.subscription.currentPeriodEnd) > now
  ) {
    return true;
  }

  return false;
}

// Helper to check if user has access to a specific product/tier
export async function hasAccessToProduct(productId: string): Promise<boolean> {
  const result = await getSubscriptionDetails();
  if (!result.hasSubscription || !result.subscription) {
    return false;
  }

  const now = new Date();
  const isActive = result.subscription.status === "active";
  const isInGracePeriod =
    isActive &&
    result.subscription.cancelAtPeriodEnd &&
    new Date(result.subscription.currentPeriodEnd) > now;

  return (
    (isActive || isInGracePeriod) && result.subscription.productId === productId
  );
}

// Helper to get user's current subscription status
export async function getUserSubscriptionStatus(): Promise<
  "active" | "canceled" | "expired" | "none"
> {
  const result = await getSubscriptionDetails();
  if (!result.hasSubscription || !result.subscription) {
    return "none";
  }

  const now = new Date();

  // Explicitly canceled (immediate cancellation)
  if (result.subscription.status === "canceled") {
    return "canceled";
  }

  // Expired (past period end date)
  if (new Date(result.subscription.currentPeriodEnd) <= now) {
    return "expired";
  }

  // Active subscription (including grace period)
  if (result.subscription.status === "active") {
    return "active";
  }

  return "none";
}
