'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useEffect, useState } from 'react'

export default function NavBar() {
    const pathname = usePathname()
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })
    const homeRef = useRef<HTMLAnchorElement>(null)
    const mailRef = useRef<HTMLAnchorElement>(null)
    const statsRef = useRef<HTMLAnchorElement>(null)

    useEffect(() => {
        const updateIndicator = () => {
            let currentRef = homeRef
            if (pathname === '/MailGeneration') currentRef = mailRef
            if (pathname === '/Stats') currentRef = statsRef

            if (currentRef.current) {
                const { offsetLeft, offsetWidth } = currentRef.current
                setIndicatorStyle({
                    left: offsetLeft,
                    width: offsetWidth,
                })
            }
        }

        updateIndicator()
        window.addEventListener('resize', updateIndicator)
        return () => window.removeEventListener('resize', updateIndicator)
    }, [pathname])

    return (
        <nav className="bg-white text-gray-800 shadow-md p-4 mb-8">
            <div className="container mx-auto flex justify-center items-center relative">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div
                        className="absolute h-[calc(100%-8px)] top-1 rounded-lg border border-blue-200 bg-blue-50 transition-all duration-300 ease-in-out"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`,
                        }}
                    />
                </div>
                
                <Link
                    ref={homeRef}
                    href="/"
                    className={`z-10 mx-6 px-4 py-2 transition-colors duration-300 ${
                        pathname === '/' ? 'text-blue-600' : 'hover:text-gray-600'
                    }`}
                >
                    Hem
                </Link>
                <Link
                    ref={mailRef}
                    href="/MailGeneration"
                    className={`z-10 mx-6 px-4 py-2 transition-colors duration-300 ${
                        pathname === '/MailGeneration' ? 'text-blue-600' : 'hover:text-gray-600'
                    }`}
                >
                    E-post Assistent
                </Link>
                <Link
                    ref={statsRef}
                    href="/Stats"
                    className={`z-10 mx-6 px-4 py-2 transition-colors duration-300 ${
                        pathname === '/Stats' ? 'text-blue-600' : 'hover:text-gray-600'
                    }`}
                >
                    Statistik
                </Link>
            </div>
        </nav>
    )
}
