"use client";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { authClient } from "~/lib/auth-client";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { env } from "~/env";
import { BorderBeam } from "~/components/ui/border-beam";

type SubscriptionDetails = {
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

type SubscriptionDetailsResult = {
  hasSubscription: boolean;
  subscription?: SubscriptionDetails;
  error?: string;
  errorType?: "CANCELED" | "EXPIRED" | "GENERAL";
};

interface PricingTableProps {
  subscriptionDetails: SubscriptionDetailsResult;
}


export default function PricingTable({
  subscriptionDetails
}: PricingTableProps ) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await authClient.getSession();
        setIsAuthenticated(!!session.data?.user);
      } catch {
        setIsAuthenticated(false);
      }
    };
    void checkAuth();
  }, []);

  const handleCheckout = async (productId: string, slug: string) => {
    if (isAuthenticated === false) {
      router.push("/sign-in");
      return;
    }

    try {
      await authClient.checkout({
        products: [productId],
        slug: slug,
      });
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error("Oops, something went wrong");
    }
  };

  const handleManageSubscription = async () => {
    try {
      await authClient.customer.portal();
    } catch (error) {
      console.error("Failed to open customer portal:", error);
      toast.error("Failed to open subscription management");
    }
  };

  const STARTER_TIER = env.NEXT_PUBLIC_STARTER_TIER;
  const STARTER_SLUG = env.NEXT_PUBLIC_STARTER_SLUG;

  const LIFETIME_TIER = env.NEXT_PUBLIC_LIFETIME_TIER;
  const LIFETIME_SLUG = env.NEXT_PUBLIC_LIFETIME_SLUG;

  if (!STARTER_TIER || !STARTER_SLUG || !LIFETIME_TIER || !LIFETIME_SLUG) {
    throw new Error("Missing required environment variables for Starter tier");
  }

  const isCurrentPlan = (tierProductId: string) => {
    return (
      subscriptionDetails.hasSubscription &&
      subscriptionDetails.subscription?.productId === tierProductId &&
      subscriptionDetails.subscription?.status === "active"
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <section className="flex flex-col items-center justify-center px-4  w-full min-h-screen" >

      <div className="text-center mb-12 flex flex-col items-center justify-center gap-10">

        <div className="overflow-hidden relative rounded-full bg-zinc-900">
          <span className="text-sm px-2 font-dancing-script font-semibold text-zinc-600 ">✨Pricing </span>
          <BorderBeam size={30} duration={10}/>
        </div>

        <div>
          <h1 className="text-4xl font-medium tracking-tight mb-4">
            Fake Pricing
          </h1>
          <p className="text-xl text-muted-foreground">
          Begin your journey of building NOW!!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-fit ">
        {/* Starter Tier */}
        <Card className="relative h-fit">
          {isCurrentPlan(STARTER_TIER) && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Current Plan
              </Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Starter</CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold flex items-center gap-1">$ <span>99</span></span>
              <span className="text-muted-foreground">usd</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Limited features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Limited AI usage</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Track progress with detailed insights</span>
            </div>
          </CardContent>
          <CardFooter>
            {isCurrentPlan(STARTER_TIER) ? (
              <div className="w-full space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
                {subscriptionDetails.subscription && (
                  <p className="text-sm text-muted-foreground text-center">
                    {subscriptionDetails.subscription.cancelAtPeriodEnd
                      ? `Expires ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`
                      : `Renews ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col w-full gap-2">

              <Button
                className="w-full"
                onClick={() => handleCheckout(STARTER_TIER, STARTER_SLUG)}
                >
                {isAuthenticated === false
                  ? "Sign In to Get Started"
                  : "Get Started"}
              </Button>

              <p className="text-muted-foreground text-sm">Pay once. Learn unlimited times!</p>
              </div>
            )}
          </CardFooter>
        </Card>
            {/* Lifetime Tier */}
        <Card className="relative h-fit">
          {isCurrentPlan(LIFETIME_TIER) && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                Current Plan
              </Badge>
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-2xl">Lifetime Deal</CardTitle>
            <CardDescription>Best value for dedicated folks</CardDescription>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-bold flex items-center gap-1">$ <span>250</span></span>
              <span className="text-muted-foreground">usd</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Access to all futures features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Request new features</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-green-500" />
              <span>Get access to community</span>
            </div>
          </CardContent>
          <CardFooter>
            {isCurrentPlan(LIFETIME_TIER) ? (
              <div className="w-full space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
                {subscriptionDetails.subscription && (
                  <p className="text-sm text-muted-foreground text-center">
                    {subscriptionDetails.subscription.cancelAtPeriodEnd
                      ? `Expires ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`
                      : `Renews ${formatDate(subscriptionDetails.subscription.currentPeriodEnd)}`}
                  </p>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center flex-col w-full gap-2">

              <Button
                className="w-full"
                onClick={() => handleCheckout(LIFETIME_TIER, LIFETIME_SLUG)}
                >
                {isAuthenticated === false
                  ? "Sign In to Get Started"
                  : "Get Started"}
              </Button>

              <p className="text-muted-foreground text-sm">Pay once. Learn unlimited times!</p>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>

 
    </section>
  )
}