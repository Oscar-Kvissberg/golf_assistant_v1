import React from 'react'
import OpenAIBot from '../../components/OpenAIBot'
import { clubs } from '../../config/clubs'

type Props = {
  params: Promise<{ club: string }>
}

export async function generateStaticParams() {
  return Object.keys(clubs).map((club) => ({
    club: club,
  }))
}

export default async function MailGenerationPage({ params }: Props) {
  await params
  
  return (
    <div className="container mx-auto px-4 py-8">
      <OpenAIBot />
    </div>
  )
}
