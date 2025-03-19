import React from 'react'

export default function Home() {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          E-post Assistent med <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mb-12">
          Expandera din produktivitet med vår AI-drivna e-postassistent. 
          Generera professionella svar snabbt och enkelt.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a 
            href="/MailGeneration" 
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Kom igång
          </a>
          <a 
            href="/Stats" 
            className="px-8 py-4 bg-white text-gray-800 rounded-lg font-semibold border border-gray-200 hover:border-gray-300 transition-colors"
          >
            Se statistik
          </a>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-sm text-gray-500">name@creative-tim.com</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <p className="text-gray-700 font-mono">
              Låt AI:n hjälpa dig att skriva professionella e-postsvar på sekunder...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}