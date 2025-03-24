'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { clubs } from '../config/clubs';

export default function OpenAIBot() {
    const pathname = usePathname();
    const club = pathname.split('/')[1];
    const clubConfig = clubs[club];

    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const responseTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Funktion för att uppdatera textareans höjd
    const adjustTextareaHeight = () => {
        const textarea = responseTextareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(300, textarea.scrollHeight)}px`;
        }
    };

    // Uppdatera höjden när svaret ändras
    useEffect(() => {
        if (response) {
            adjustTextareaHeight();
        }
    }, [response]);

    const clearChat = () => {
        setMessage('');
        setResponse('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        if (!clubConfig) {
            setError('Kunde inte hitta klubbkonfiguration');
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch('/api/generate-response', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    assistantId: clubConfig.assistantId
                }),
            });

            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.error || 'Något gick fel vid kommunikation med assistenten');
            }

            if (data.error) {
                throw new Error(data.error);
            }

            setResponse(data.response);

            // Uppdatera räknaren i localStorage
            const currentCount = parseInt(localStorage.getItem('emailGenerationCount') || '0');
            localStorage.setItem('emailGenerationCount', (currentCount + 1).toString());

        } catch (err) {
            console.error('Error:', err);
            setError(err instanceof Error ? err.message : 'Ett fel uppstod');
        } finally {
            setIsLoading(false);
        }
    };

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
                            <h2 className="text-xl font-semibold text-gray-700">Ditt Meddelande</h2>
                            {message && (
                                <button
                                    onClick={clearChat}
                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                    title="Rensa chat"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        <textarea
                            className="w-full p-4 border border-gray-200 rounded-lg min-h-[300px] bg-gray-50/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Skriv ditt meddelande här..."
                            disabled={isLoading}
                        />
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-700">Assistentens Svar</h2>
                            <button
                                onClick={() => {
                                    if (response) {
                                        navigator.clipboard.writeText(response);
                                        setCopySuccess(true);
                                        setTimeout(() => setCopySuccess(false), 2000);
                                    }
                                }}
                                disabled={!response}
                                className={`p-2 rounded-lg flex items-center gap-1 relative ${
                                    response 
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
                        </div>
                        <textarea
                            ref={responseTextareaRef}
                            className="w-full p-4 border border-gray-200 rounded-lg min-h-[300px] h-auto bg-gray-50/80 backdrop-blur-sm focus:outline-none"
                            value={response}
                            readOnly
                            placeholder={isLoading ? "Assistenten skriver..." : "Assistentens svar kommer att visas här..."}
                            style={{ height: 'auto', minHeight: '300px', resize: 'none' }}
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
                                <span>Skickar...</span>
                            </>
                        ) : 'Skicka Meddelande'}
                    </button>
                </div>
            </div>
        </div>
    );
} 