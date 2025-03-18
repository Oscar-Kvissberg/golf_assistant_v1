'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NavBar() {
    const pathname = usePathname()

    return (
        <nav className="bg-gray-800 text-white p-4 mb-8">
            <div className="container mx-auto flex items-center">
                <Link
                    href="/"
                    className={`mr-6 hover:text-gray-300 ${pathname === '/' ? 'font-bold' : ''}`}
                >
                    Hem
                </Link>
                <Link
                    href="/MailGeneration"
                    className={`mr-6 hover:text-gray-300 ${pathname === '/MailGeneration' ? 'font-bold' : ''}`}
                >
                    E-post Assistent
                </Link>
                <Link
                    href="/Stats"
                    className={`mr-6 hover:text-gray-300 ${pathname === '/Stats' ? 'font-bold' : ''}`}
                >
                    Statistik
                </Link>
            </div>
        </nav>
    )
}
