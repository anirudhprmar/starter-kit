import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <header className="border-b p-3">
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
          <li className="cursor-pointer bg-zinc-700 p-1 rounded-sm">
            <Link href="/sign-up" className="text-xl">
            Sign up
            </Link>
            </li>
        </ul>
      </nav>
    </header>
  )
}
