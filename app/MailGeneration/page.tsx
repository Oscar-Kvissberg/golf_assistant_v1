'use client'

import { useState } from 'react'

export default function MailGeneration() {
    const [inputMail, setInputMail] = useState('')
    const [generatedResponse, setGeneratedResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copySuccess, setCopySuccess] = useState(false)

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
            
            if (!response.ok) {
                throw new Error(data.error || 'Något gick fel vid generering av svar')
            }

            if (!data || typeof data.response !== 'string') {
                throw new Error('Ogiltig svarsformat från servern')
            }

            setGeneratedResponse(data.response)
            incrementEmailCount()

        } catch (err) {
            console.error('Error:', err)
            setError(err instanceof Error ? err.message : 'Ett fel uppstod vid generering av svar')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-16">
            

            <div className="max-w-5xl mx-auto">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="grid gap-8 md:grid-cols-2">
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Inkommande E-post</h2>
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-lg min-h-[300px] bg-gray-50/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={inputMail}
                            onChange={(e) => setInputMail(e.target.value)}
                            placeholder="Klistra in e-postmeddelandet här..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Föreslaget Svar</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        if (generatedResponse) {
                                            navigator.clipboard.writeText(generatedResponse);
                                            setCopySuccess(true);
                                            setTimeout(() => setCopySuccess(false), 2000);
                                        }
                                    }}
                                    disabled={!generatedResponse}
                                    className={`p-2 rounded-lg flex items-center gap-1 relative ${
                                        generatedResponse 
                                            ? 'bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors' 
                                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                                    }`}
                                    title="Kopiera svar"
                                >
                                    {copySuccess ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                    )}
                                    {copySuccess && (
                                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                                            Kopierat!
                                        </span>
                                    )}
                                </button>
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-lg min-h-[300px] bg-gray-50/80 backdrop-blur-sm focus:outline-none"
                            value={generatedResponse}
                            readOnly
                            placeholder={isLoading ? "Genererar svar..." : "Det genererade svaret kommer att visas här..."}
                        />
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`
                            px-8 py-4 rounded-lg font-semibold flex items-center gap-2
                            ${isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-opacity'
                            }
                            text-white
                        `}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Genererar svar...</span>
                            </>
                        ) : 'Generera Svar'}
                    </button>
                </div>
            </div>
        </div>
    )
}
