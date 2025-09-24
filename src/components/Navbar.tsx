import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <header className="fixed border-b p-3 min-w-full bg-neutral-950 z-50">
      <nav className="flex justify-between items-center">
        <div className="text-2xl">
          <p className="font-bold">
            <Link href="/">
            Starter Kit
            </Link>
            </p>
        </div>
        <ul className="flex gap-5 items-center">
          <li className="cursor-pointer">
            <Link href="/sign-in" className="text-xl">
            Log in
            </Link>
            </li>
          <li className="cursor-pointer bg-primary dark:bg-primary-foreground  p-1 rounded-sm">
            <Link href="/sign-up" className="text-xl text-white">
            Sign up
            </Link>
            </li>
        </ul>
      </nav>
    </header>
  )
}
