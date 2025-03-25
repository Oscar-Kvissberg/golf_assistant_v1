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

        // Vänta på svar
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
        while (runStatus.status !== 'completed') {
            if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
                console.error('Run misslyckades:', runStatus)
                return NextResponse.json(
                    { error: `Assistenten misslyckades: ${runStatus.status}` },
                    { status: 500 }
                )
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
            runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
        }

        // Hämta svaret - ta det sista (äldsta) meddelandet från assistenten
        const messages = await openai.beta.threads.messages.list(thread.id)
        const assistantMessages = messages.data.filter(msg => 
            msg.role === 'assistant' && 
            msg.content[0] && 
            msg.content[0].type === 'text'
        )
        
        // Ta det sista meddelandet (det äldsta)
        const lastMessage = assistantMessages[assistantMessages.length - 1]

        if (!lastMessage || !lastMessage.content[0] || lastMessage.content[0].type !== 'text') {
            console.error('Inget giltigt svar mottaget:', messages)
            return NextResponse.json(
                { error: 'Inget giltigt svar mottaget från assistenten' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            response: lastMessage.content[0].text.value
        })

    } catch (error) {
        console.error('Detaljerat fel:', error)
        return NextResponse.json(
            { error: `Ett fel uppstod: ${error instanceof Error ? error.message : 'Okänt fel'}` },
            { status: 500 }
        )
    }
} 