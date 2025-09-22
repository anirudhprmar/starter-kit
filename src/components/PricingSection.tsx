import React from 'react'
import PricingTable from '~/app/pricing/_component/pricing-table'
import { getSubscriptionDetails } from '~/lib/subscription'

export default async function PricingSection() {
          const subscriptionDetails = await getSubscriptionDetails()

  return (
   <section className="mb-10 min-h-screen container mx-auto " >
      <div className="flex flex-col items-center justify-center">
          <PricingTable subscriptionDetails={subscriptionDetails}/>
      </div>
      </section>
  )
}
