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

        // Hämta svaret
        const messages = await openai.beta.threads.messages.list(thread.id)
        const assistantMessage = messages.data[0]

        if (!assistantMessage || !assistantMessage.content || !assistantMessage.content[0]) {
            console.error('Inget svar mottaget:', messages)
            return NextResponse.json(
                { error: 'Inget svar mottaget från assistenten' },
                { status: 500 }
            )
        }

        const messageContent = assistantMessage.content[0]

        if ('text' in messageContent) {
            return NextResponse.json({
                response: messageContent.text.value || messageContent.text
            })
        }

        console.error('Oväntat svarsformat:', messageContent)
        return NextResponse.json(
            { error: 'Oväntat svarsformat från assistenten' },
            { status: 500 }
        )

    } catch (error) {
        console.error('Detaljerat fel:', error)
        return NextResponse.json(
            { error: `Ett fel uppstod: ${error instanceof Error ? error.message : 'Okänt fel'}` },
            { status: 500 }
        )
    }
} 