import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { db } from "~/server/db";
import { admin } from "better-auth/plugins";
import { magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { polar, checkout, portal, webhooks } from "@polar-sh/better-auth";
import { Polar } from "@polar-sh/sdk";
import { account, session, subscription, user, verification } from '~/server/db/schema';
import { env } from "~/env";

// Utility function to safely parse dates
function safeParseDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

const resend = new Resend(env.RESEND_API_KEY);

const polarClient = new Polar({
  accessToken: env.POLAR_ACCESS_TOKEN,
  // server: 'production'
  server: "sandbox",
});

export const auth = betterAuth({
  trustedOrigins: [env.NEXT_PUBLIC_APP_URL],
  allowedDevOrigins: [env.NEXT_PUBLIC_APP_URL],
  cookieCache: {
    enabled: true,
    maxAge: 5 * 60, // Cache duration in seconds
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user,
      session,
      account,
      verification,
      subscription
    },
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId:
                env.NEXT_PUBLIC_STARTER_TIER ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_STARTER_TIER environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_STARTER_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_STARTER_SLUG environment variable is required",
                  );
                })(),
            },
            {
              productId:
                env.NEXT_PUBLIC_LIFETIME_TIER ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_LIFETIME_TIER environment variable is required",
                  );
                })(),
              slug:
                env.NEXT_PUBLIC_LIFETIME_SLUG ??
                (() => {
                  throw new Error(
                    "NEXT_PUBLIC_LIFETIME_SLUG environment variable is required",
                  );
                })(),
            },
          ],
          successUrl: `${env.NEXT_PUBLIC_APP_URL}/${env.POLAR_SUCCESS_URL}`,
          authenticatedUsersOnly: true,
        }),
        portal(),
        webhooks({
          secret:
            env.POLAR_WEBHOOK_SECRET ??
            (() => {
              throw new Error(
                "POLAR_WEBHOOK_SECRET environment variable is required",
              );
            })(),
          onPayload: async ({ data, type }) => {
            if (
              type === "subscription.created" ||
              type === "subscription.active" ||
              type === "subscription.canceled" ||
              type === "subscription.revoked" ||
              type === "subscription.uncanceled" ||
              type === "subscription.updated"
            ) {
              // console.log("🎯 Processing subscription webhook:", type);
              // console.log("📦 Payload data:", JSON.stringify(data, null, 2));

              try {
                // STEP 1: Extract user ID from customer data
                const userId = data.customer?.externalId;
                // STEP 2: Build subscription data
                const subscriptionData = {
                  id: data.id,
                  createdAt: new Date(data.createdAt),
                  modifiedAt: safeParseDate(data.modifiedAt),
                  amount: data.amount,
                  currency: data.currency,
                  recurringInterval: data.recurringInterval,
                  status: data.status,
                  currentPeriodStart:
                    safeParseDate(data.currentPeriodStart) ?? new Date(),
                  currentPeriodEnd:
                    safeParseDate(data.currentPeriodEnd) ?? new Date(),
                  cancelAtPeriodEnd: data.cancelAtPeriodEnd || false,
                  canceledAt: safeParseDate(data.canceledAt),
                  startedAt: safeParseDate(data.startedAt) ?? new Date(),
                  endsAt: safeParseDate(data.endsAt),
                  endedAt: safeParseDate(data.endedAt),
                  customerId: data.customerId,
                  productId: data.productId,
                  discountId: data.discountId ?? null,
                  checkoutId: data.checkoutId ?? "",
                  customerCancellationReason:
                    data.customerCancellationReason ?? null,
                  customerCancellationComment:
                    data.customerCancellationComment ?? null,
                  metadata: data.metadata
                    ? JSON.stringify(data.metadata)
                    : null,
                  customFieldData: data.customFieldData
                    ? JSON.stringify(data.customFieldData)
                    : null,
                  userId: userId,
                };

                // console.log("💾 Final subscription data:", {
                // id: subscriptionData.id,
                // status: subscriptionData.status,
                // userId: subscriptionData.userId,
                // amount: subscriptionData.amount,
                // });

                // STEP 3: Use Drizzle's onConflictDoUpdate for proper upsert
                await db
                  .insert(subscription)
                  .values(subscriptionData)
                  .onConflictDoUpdate({
                    target: subscription.id,
                    set: {
                      modifiedAt: subscriptionData.modifiedAt ?? new Date(),
                      amount: subscriptionData.amount,
                      currency: subscriptionData.currency,
                      recurringInterval: subscriptionData.recurringInterval,
                      status: subscriptionData.status,
                      currentPeriodStart: subscriptionData.currentPeriodStart,
                      currentPeriodEnd: subscriptionData.currentPeriodEnd,
                      cancelAtPeriodEnd: subscriptionData.cancelAtPeriodEnd,
                      canceledAt: subscriptionData.canceledAt,
                      startedAt: subscriptionData.startedAt,
                      endsAt: subscriptionData.endsAt,
                      endedAt: subscriptionData.endedAt,
                      customerId: subscriptionData.customerId,
                      productId: subscriptionData.productId,
                      discountId: subscriptionData.discountId,
                      checkoutId: subscriptionData.checkoutId,
                      customerCancellationReason:
                        subscriptionData.customerCancellationReason,
                      customerCancellationComment:
                        subscriptionData.customerCancellationComment,
                      metadata: subscriptionData.metadata,
                      customFieldData: subscriptionData.customFieldData,
                      userId: subscriptionData.userId,
                    },
                  });

                // console.log("✅ Upserted subscription:", data.id);
              } catch (error) {
                console.error(
                  "💥 Error processing subscription webhook:",
                  error,
                );
                // Don't throw - let webhook succeed to avoid retries
              }
            }
          },
        }),
      ],
    }),
    magicLink({
      sendMagicLink: async ({ email, url }, _request) => {
        try {
          const { data, error } = await resend.emails.send({
            from: "Starter Kit <onboarding@resend.Starter Kit.top>",
            to: email,
            subject: "Your Magic Sign-In Link",
            html: `Click <a href="${url}">here</a> to sign in. This link will expire within 5 min.`,
          });
          if (error) {
            console.error("Resend error:", error);
            throw new Error("Failed to send magic link");
          }
          console.log("Magic link sent to:", email);
        } catch (error) {
          console.error("Magic link error:", error);
          throw error;
        }
      },
    }),
    admin(),
    nextCookies(),
  ],
});
