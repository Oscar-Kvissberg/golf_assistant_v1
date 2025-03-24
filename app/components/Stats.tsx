'use client'

import React, { useEffect, useState } from 'react'

const TOP_QUESTIONS = [
    "Hur kan jag boka en tid?",
    "Vad kostar greenfee?",
    "Vilka är öppettiderna?",
    "Finns det proffsshop?",
    "Hur kommer jag hit?"
]

export default function Stats() {
    const [emailCount, setEmailCount] = useState(0)
    const [timeSaved, setTimeSaved] = useState(0)
    const [golfBalls, setGolfBalls] = useState(0)
    const [funFact, setFunFact] = useState('')

    useEffect(() => {
        // Ladda statistik från localStorage
        const count = parseInt(localStorage.getItem('emailGenerationCount') || '0')
        setEmailCount(count)
        
        // Beräkna tid sparad (5 minuter per mail)
        setTimeSaved(count * 5)
        
        // Beräkna golfbollar (1 golfboll per mail)
        setGolfBalls(count)
        
        // Generera rolig fakta baserat på antal golfbollar
        if (count > 0) {
            const facts = [
                `Detta motsvarar ${count} golfbollar!`,
                `Detta är lika många golfbollar som i ${Math.ceil(count / 12)} golfbollspåsar!`,
                `Om du skulle lägga ut alla dessa golfbollar på en rad skulle den vara ${count * 4.27} meter lång!`,
                `Detta är tillräckligt med golfbollar för ${Math.ceil(count / 18)} rundor golf!`
            ]
            setFunFact(facts[Math.floor(Math.random() * facts.length)])
        }
    }, [])

    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Statistik-kort */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Genererade Mail</h3>
                <p className="text-3xl font-bold text-blue-600">{emailCount}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Tid Sparad</h3>
                <p className="text-3xl font-bold text-green-600">{timeSaved} min</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Golfbollar</h3>
                <p className="text-3xl font-bold text-purple-600">{golfBalls}</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Rolig Fakta</h3>
                <p className="text-lg text-gray-600">{funFact}</p>
            </div>

            {/* Vanliga frågor */}
            <div className="md:col-span-2 lg:col-span-4 bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Vanliga Frågor</h3>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {TOP_QUESTIONS.map((question, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">{question}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 