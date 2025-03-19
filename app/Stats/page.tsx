'use client'

import { useEffect, useState } from 'react'

export default function Stats() {
    const [emailCount, setEmailCount] = useState(0)
    const MINUTES_PER_EMAIL = 5 // Genomsnittlig tid att skriva ett mejl
    const BALLS_PER_MINUTE = 2 // Antal bollar man kan slå per minut på rangen

    useEffect(() => {
        // Hämta antalet från localStorage när komponenten laddas
        const count = localStorage.getItem('emailGenerationCount')
        setEmailCount(count ? parseInt(count) : 0)
    }, [])

    const calculateTimeSaved = () => {
        const totalMinutes = emailCount * MINUTES_PER_EMAIL
        const hours = Math.floor(totalMinutes / 60)
        const minutes = totalMinutes % 60

        if (hours === 0) {
            return `${minutes} minuter`
        } else if (hours === 1) {
            return `1 timme och ${minutes} minuter`
        } else {
            return `${hours} timmar och ${minutes} minuter`
        }
    }

    const calculateGolfBalls = () => {
        const totalMinutes = emailCount * MINUTES_PER_EMAIL
        const totalBalls = totalMinutes * BALLS_PER_MINUTE
        return totalBalls
    }

    const getFunFact = () => {
        const totalBalls = calculateGolfBalls()

        if (totalBalls < 50) {
            return "Det räcker för en kort uppvärmning på rangen! 🏌️‍♂️"
        } else if (totalBalls < 100) {
            return "Nu börjar vi snacka om ett riktigt rangepass! 🏌️‍♂️"
        } else if (totalBalls < 200) {
            return "Du kunde ha övat som en proffs på rangen! 🏆"
        } else if (totalBalls < 500) {
            return "Det här är mer bollar än Tiger Woods slår på en träningsdag! 🐯"
        } else {
            return "Du kunde ha öppnat din egen driving range! 🏌️‍♂️🎯"
        }
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 text-center mb-4">Din Produktivitet</h1>
            <p className="text-gray-600 text-center mb-12 text-lg">Se hur mycket tid du sparat med vår AI-assistent</p>

            <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Genererade Svar</h2>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-blue-600 mb-2">{emailCount}</p>
                        <p className="text-gray-500">e-postmeddelanden</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Sparad Tid</h2>
                            <div className="p-2 bg-green-50 rounded-lg">
                                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-5xl font-bold text-green-600 mb-2">{calculateTimeSaved()}</p>
                        <p className="text-gray-500">baserat på {MINUTES_PER_EMAIL} min per mejl</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 max-w-5xl mx-auto">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-semibold">Alternativ Användning</h2>
                            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-6xl font-bold mb-4">{calculateGolfBalls()}</p>
                        <p className="text-xl mb-2 text-white text-opacity-90">golfbollar på rangen</p>
                        <p className="text-white text-opacity-90 text-lg">{getFunFact()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
