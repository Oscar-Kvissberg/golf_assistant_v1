'use client'

import { useEffect, useState } from 'react'

export default function Stats() {
    const [emailCount, setEmailCount] = useState(0)
    const MINUTES_PER_EMAIL = 5 // Genomsnittlig tid att skriva ett mejl

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

    const getFunFact = () => {
        const totalMinutes = emailCount * MINUTES_PER_EMAIL

        if (totalMinutes < 60) {
            return "Det räcker för att lyssna på några favoritlåtar! 🎵"
        } else if (totalMinutes < 120) {
            return "Du kunde ha sett ett avsnitt av din favoritserie istället! 📺"
        } else if (totalMinutes < 180) {
            return "Du har sparat tillräckligt med tid för att se en hel film! 🎬"
        } else if (totalMinutes < 300) {
            return "Du kunde ha spelat några rundor golf istället! ⛳"
        } else {
            return "Du har sparat en hel arbetsdag! Dags för semester? 🏖️"
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
                        <h2 className="text-xl mb-2">Kul Att Veta!</h2>
                        <p className="text-lg text-gray-700">
                            Med den tiden du sparat kunde du ha gjort något annat kul...
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
