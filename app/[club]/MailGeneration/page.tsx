import React from 'react'
import OpenAIBot from '../../components/OpenAIBot'
import { clubs } from '../../config/clubs'

type Props = {
  params: Promise<{ club: string }>
}

export default async function MailGenerationPage({ params }: Props) {
  const { club } = await params
  const clubConfig = clubs[club] || clubs.vasatorp
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Mailgenerering för {clubConfig.displayName}</h1>
      <OpenAIBot />
    </div>
  )
}
