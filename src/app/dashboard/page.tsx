import { auth } from "~/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { isUserSubscribed } from "~/lib/subscription"
import Link from "next/link"
import { Button } from "~/components/ui/button"
import Welcome from "./_components/Welcome"
import { getUserPurchaseStatus } from "~/lib/oneTimePurchase"

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers:await headers()
  })

  if(!session) {
        redirect("/")
    }
const username = session.user.name
// const userId = session.user.id
 const isSubscribed = await isUserSubscribed()
 const isPurchased = await getUserPurchaseStatus()

    if (!isSubscribed && isPurchased !== "paid") {
        return ( <div className="absolute inset-0 z-10 rounded-lg  flex items-center justify-center">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg text-center max-w-md">
          <h3 className="text-xl font-semibold mb-2">
            Payment Required
          </h3>
          <p className="text-muted-foreground mb-4">
            You need to pay to access dashboard
          </p>
          <Link href="/pricing">
            <Button>Pay Now</Button>
          </Link>
        </div>
      </div>)
    
    }


  // return <DashboardDisplay userId={userId} username={username} />
  return <Welcome name={username} />
}
