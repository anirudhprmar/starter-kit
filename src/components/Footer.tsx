import Link from 'next/link'
import React from 'react'

export default function Footer() {
  return (
    <footer>
        <div className="flex items-center justify-around p-5 border-t">
          <p className="text-xl">
            © 2025 Anirudh Parmar, All rights reserved
          </p>
          <p className="text-xl">
            <Link href={'https://x.com/anirudhprmar'} 
              rel="noopener noreferrer"
              target="_blank"
            >
            X
            </Link>
          </p>
        </div>
      </footer>
  )
}
