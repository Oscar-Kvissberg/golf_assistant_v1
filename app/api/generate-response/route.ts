import { NextResponse } from 'next/server'
import OpenAI from 'openai'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY saknas i miljövariablerna')
}

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function POST(request: Request) {
    try {
        const { message, assistantId } = await request.json()

        if (!message) {
            return NextResponse.json(
                { error: 'Meddelande krävs' },
                { status: 400 }
            )
        }

        // Skapa en thread
        const thread = await openai.beta.threads.create()

        // Skapa ett meddelande
        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: message
        })

        // Kör assistenten
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistantId
        })

        // Vänta på svar
        let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
        while (runStatus.status !== 'completed') {
            if (runStatus.status === 'failed' || runStatus.status === 'cancelled') {
                return NextResponse.json(
                    { error: 'Assistenten kunde inte generera ett svar' },
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

        return NextResponse.json(
            { error: 'Oväntat svarsformat från assistenten' },
            { status: 500 }
        )

    } catch (error) {
        console.error('Error in handler:', error)
        return NextResponse.json(
            { error: 'Ett fel uppstod vid generering av svar' },
            { status: 500 }
        )
    }
} 