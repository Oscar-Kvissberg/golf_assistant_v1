'use client'

import { useState } from 'react'

export default function MailGeneration() {
    const [inputMail, setInputMail] = useState('')
    const [generatedResponse, setGeneratedResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const incrementEmailCount = () => {
        const currentCount = parseInt(localStorage.getItem('emailGenerationCount') || '0')
        localStorage.setItem('emailGenerationCount', (currentCount + 1).toString())
    }

    const handleSubmit = async () => {
        if (!inputMail.trim()) {
            setError('Vänligen ange ett e-postmeddelande')
            return
        }

        setIsLoading(true)
        setError(null)
        setGeneratedResponse('')

        try {
            const response = await fetch('/api/generate-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputMail,
                    assistantId: 'asst_qZsHsAUoPZ0gH0HqBLLhCdeZ'
                })
            })

            const data = await response.json()
            console.log('Received data:', data)

            if (!response.ok) {
                throw new Error(data.error || 'Något gick fel vid generering av svar')
            }

            if (!data || !data.response) {
                throw new Error('Inget svar mottaget från servern')
            }

            setGeneratedResponse(data.response)
            incrementEmailCount()

        } catch (err) {
            console.error('Error:', err)
            setError(err instanceof Error ? err.message : 'Ett fel uppstod')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">E-post Assistent</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-2">Klistra in ditt e-postmeddelande här:</label>
                    <textarea
                        className="w-full p-2 border rounded-md min-h-[400px]"
                        value={inputMail}
                        onChange={(e) => setInputMail(e.target.value)}
                        placeholder="Klistra in e-postmeddelandet här..."
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block mb-2">Genererat svar:</label>
                    <textarea
                        className="w-full p-2 border rounded-md min-h-[400px]"
                        value={generatedResponse}
                        readOnly
                        placeholder={isLoading ? "Genererar svar..." : "Det genererade svaret kommer att visas här..."}
                    />
                </div>
            </div>

            <div className="mt-4">
                <button
                    onClick={handleSubmit}
                    className={`${isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 hover:bg-blue-600'
                        } text-white px-4 py-2 rounded-md flex items-center justify-center w-full sm:w-auto`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Genererar svar (kan ta upp till 30 sekunder)...
                        </>
                    ) : 'Generera Svar'}
                </button>
            </div>
        </div>
    )
}
