import React from 'react'
import { Button } from './ui/button'
import { ArrowRight } from 'lucide-react'
import { BorderBeam } from './ui/border-beam'

export default function HeroSection() {
  return (
    <section className="flex flex-col gap-15 items-center justify-center min-h-screen container mx-auto ">
          <div className="relative rounded-full bg-zinc-900  overflow-hidden">
            <span className="text-sm px-2 font-dancing-script font-semibold text-zinc-600 ">✨Introducing Starter Kit</span>
            <BorderBeam size={30} duration={10}/>
          </div>
          <div className="flex flex-col gap-10 items-center justify-center  text-center">
            {/* <h1 className="text-6xl font-bold text-center">Ship fast with Modern Next.js Starter Kit </h1> */}
            <h1 className="font-extrabold text-4xl lg:text-6xl tracking-tight md:-mb-4 flex flex-col gap-3 items-center lg:items-start">
              <span className="relative">Stop Wasting Time.</span>

              <span className="whitespace-nowrap relative "><span className="mr-3 sm:mr-4 md:mr-5"></span>
              <span className=" relative whitespace-nowrap">
                <span className="absolute bg-zinc-300 -left-2 -top-1 -bottom- -right-2 md:-left-2 md:top-1 md:-bottom-0 md:-right-3 -rotate-2"></span>
                <span className="relative text-neutral-900">Just Launch🔥.</span>
              </span>
              </span>

              </h1>
            <p className="text-xl md:text-2xl opacity-80 leading-relaxed ">A day not building is a day not earning.</p>
         
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
            <Button size={'lg'} variant={'default'} className="flex text-xl cursor-pointer justify-center items-center">⚡Get Started <ArrowRight className="ml-2 size-4"/> </Button>

            <Button size={'lg'} variant={'secondary'} className="flex text-xl cursor-pointer justify-center items-center">Github </Button>

            </div>
          </div>

       </section>
  )
}
