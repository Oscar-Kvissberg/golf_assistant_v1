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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Statistik</h1>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center">
                        <h2 className="text-xl mb-2">Genererade E-post Svar</h2>
                        <p className="text-4xl font-bold text-blue-600">{emailCount}</p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6">
                    <div className="text-center">
                        <h2 className="text-xl mb-2">Sparad Tid</h2>
                        <p className="text-4xl font-bold text-green-600">
                            {calculateTimeSaved()}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            Baserat på en genomsnittlig tid på {MINUTES_PER_EMAIL} minuter per mejl
                        </p>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 md:col-span-2">
                    <div className="text-center">
                        <h2 className="text-xl mb-2">Så här många bollar hade du kunnat slå på rangen istället:</h2>
                        <p className="text-4xl font-bold text-indigo-600 mb-2">
                            {calculateGolfBalls()} bollar
                        </p>
                        <p className="text-lg text-gray-700">
                            Med den sparade tiden kunde du ha slagit så här många bollar på rangen...
                        </p>
                        <p className="text-xl font-semibold text-indigo-600 mt-2">
                            {getFunFact()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
