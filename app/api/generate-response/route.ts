import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const apiKey = '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'

export async function POST(request: Request) {
    try {
        const openai = new OpenAI({
            apiKey: apiKey
        })

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