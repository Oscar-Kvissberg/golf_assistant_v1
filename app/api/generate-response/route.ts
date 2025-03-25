import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { message, assistantId } = body

        if (!message) {
            return NextResponse.json(
                { error: 'Meddelande krävs' },
                { status: 400 }
            )
        }

        if (!process.env.OPENAI_API_KEY) {
            console.error('API-nyckel saknas')
            return NextResponse.json(
                { error: 'API-nyckel saknas' },
                { status: 500 }
            )
        }

        try {
            // Skapa en thread
            const thread = await openai.beta.threads.create()
            console.log('Thread skapad:', thread.id)

            // Skapa ett meddelande
            await openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: message
            })
            console.log('Meddelande skapat')

            // Kör assistenten
            const run = await openai.beta.threads.runs.create(thread.id, {
                assistant_id: assistantId
            })
            console.log('Run skapad:', run.id)

            // Vänta på svar med timeout på 30 sekunder
            let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
            let attempts = 0
            const maxAttempts = 30 // 30 sekunder
            
            while (runStatus.status !== 'completed' && attempts < maxAttempts) {
                if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
                    console.error('Run misslyckades:', runStatus)
                    throw new Error(`Assistenten misslyckades: ${runStatus.status}`)
                }
                await new Promise(resolve => setTimeout(resolve, 1000))
                runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
                attempts++
            }

            if (attempts >= maxAttempts) {
                throw new Error('Timeout: Assistenten tog för lång tid på sig att svara')
            }

            // Hämta svaret
            const messages = await openai.beta.threads.messages.list(thread.id)
            const assistantMessages = messages.data.filter(msg => 
                msg.role === 'assistant' && 
                msg.content[0] && 
                msg.content[0].type === 'text'
            )
            
            if (assistantMessages.length === 0) {
                throw new Error('Inget svar mottaget från assistenten')
            }

            const lastMessage = assistantMessages[assistantMessages.length - 1]
            if (!lastMessage.content[0] || lastMessage.content[0].type !== 'text') {
                throw new Error('Ogiltigt svar från assistenten')
            }

            return NextResponse.json({
                response: lastMessage.content[0].text.value
            })

        } catch (error: any) {
            console.error('OpenAI API fel:', error)
            const errorMessage = error?.message || 'Ett okänt fel uppstod vid kommunikation med assistenten'
            return NextResponse.json(
                { error: errorMessage },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Detaljerat fel:', error)
        // Säkerställ att vi alltid returnerar ett giltigt JSON-svar
        return NextResponse.json(
            { error: `Ett fel uppstod: ${error instanceof Error ? error.message : 'Okänt fel'}` },
            { status: 500 }
        )
    }
} 