import React from 'react'
import { BorderBeam } from './ui/border-beam'
import FeatureCard from './FeatureCard'

export default function Features() {
  return (
     <section className="min-h-screen container mx-auto max-w-250">

        <div className="flex flex-col gap-10 items-center justify-center">

          <div className="relative overflow-hidden rounded-full bg-zinc-900">
            <span className="text-sm px-2 font-dancing-script font-semibold text-zinc-600 ">✨ PowerHouse of Modern Tools </span>
            <BorderBeam size={30} duration={10}/>
          </div>

          <div className="flex flex-col gap-5 text-center items-center justify-center">
            <h2 className="font-extrabold text-2xl lg:text-3xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center lg:items-start">Built with the best tools</h2>
            <p className="text-lg opacity-80 leading-relaxed ">Launch your project with confidence, knowing that you&apos;re using the best tools available.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-15 md:px-0 gap-5 ">
          
         <FeatureCard
         tech='Next.js'
         desc='Next.js enables you to create high-quality web applications'
         imgSrc='next.svg'
         url='https://nextjs.org'
         />
         <FeatureCard
         tech='Better Auth'
         desc='The most comprehensive authentication framework for TypeScript.'
         imgSrc='auth.png'
         url='https://www.better-auth.com/'
         />

          <FeatureCard
         tech='Neon Postgres'
         desc='Serverless platform designed to help you build reliable and scalable '
         imgSrc='color.png'
         url='https://neon.com/'
         />

          <FeatureCard
         tech='Polar.sh'
         desc='Turn your software into a business with 6 lines of code '
         imgSrc='polar.png'
         url='https://polar.sh/'
         />
          
          <FeatureCard
         tech='Tailwind CSS'
         desc='Rapidly build modern websites without ever leaving your HTML '
         imgSrc='tailwind.svg'
         url='https://tailwindcss.com/'
         />

          <FeatureCard
         tech='ShadCn'
         desc='A set of beautifully designed components that you can customize,'
         imgSrc='shadcn.png'
         url='https://ui.shadcn.com/'
         />
          

          </div>

           <p className="text-lg opacity-80 leading-relaxed ">and many more.</p>
        </div>

       </section>
  )
}
