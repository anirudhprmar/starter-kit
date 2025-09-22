import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {
  Card,
  CardContent,
} from "~/components/ui/card";

export default function FeatureCard({tech,imgSrc,desc,url}:{tech:string,imgSrc:string,desc:string,url:string}) {
  return (
    <>
    
   <Card className='bg-primary text-primary-foreground transform  transition-all hover:scale-105'>
  <CardContent>
    <Link href={url} >
        <Image src={`/${imgSrc}`} height={40} width={40} alt="next js logo" className="rounded-full "/>
        <p className="text-2xl font-bold">{tech}</p>
        <span>{desc}...</span>
    </Link>
  </CardContent>

</Card>
    </>
  )
}
