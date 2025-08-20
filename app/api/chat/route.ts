import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Get API key from environment variable
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY environment variable is not set. Please create a .env file with your OpenAI API key.')
}

const openai = new OpenAI({
  apiKey: apiKey,
})

// Simple in-memory cache for responses
const responseCache = new Map()

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Create cache key from message and recent history
    const cacheKey = `${message}-${JSON.stringify(history.slice(-3))}`
    
    // Check cache first
    if (responseCache.has(cacheKey)) {
      const cachedResponse = responseCache.get(cacheKey)
      // Cache expires after 1 hour
      if (Date.now() - cachedResponse.timestamp < 3600000) {
        return NextResponse.json({ response: cachedResponse.response })
      }
    }

    // Check if the message is about a specific cryptocurrency
    const cryptoKeywords = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'DOT', 'LINK', 'UNI', 'MATIC', 'AVAX', 'XRP', 'LTC', 'BCH', 'ETC', 'XLM', 'VET', 'TRX', 'FIL', 'ATOM', 'NEAR', 'bitcoin', 'ethereum', 'solana', 'dogecoin', 'cardano', 'polkadot', 'chainlink', 'uniswap', 'matic', 'avalanche', 'ripple', 'litecoin', 'bitcoin cash', 'ethereum classic', 'stellar', 'vechain', 'tron', 'filecoin', 'cosmos', 'near']
    
    const isCryptoQuestion = cryptoKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    )

    // Technical analysis system message - optimized for speed
    const systemMessage = {
      role: 'system' as const,
      content: `You are TAAI Agent (Technical Analysis AI Agent), an expert financial advisor specializing in technical analysis. 

RESPONSE RULES:
1. Provide information only on technical analysis topics
2. Do not give investment advice, only provide educational information
3. CRITICAL: You MUST respond in the EXACT same language as the user's question
4. If user asks in English, respond ONLY in English
5. If user asks in Turkish, respond ONLY in Turkish
6. If user asks in any other language, respond in that language
7. Provide detailed explanations on technical indicators, chart patterns, trend analysis, etc.
8. Include risk management warnings
9. Explain complex topics in simple and understandable terms
10. Provide examples and practical information
11. Always add the disclaimer "This is not investment advice"
12. Keep responses concise but informative (max 2-3 paragraphs)
13. Use bullet points for key concepts when appropriate

LANGUAGE ENFORCEMENT: The user asked: "${message}". Detect the language and respond in EXACTLY the same language.`
    }

    // Prepare chat history - limit to last 5 messages for faster processing
    const limitedHistory = history.slice(-5)
    const messages = [
      systemMessage,
      ...limitedHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Faster model for better response time
      messages: messages,
      max_tokens: 600, // Reduced for faster responses
      temperature: 0.5, // Lower temperature for more focused responses
      presence_penalty: 0.1, // Reduce repetition
      frequency_penalty: 0.1, // Reduce repetition
    })

    const openaiResponse = completion.choices[0]?.message?.content || 'Sorry, could not generate a response.'

    // Language enforcement - ensure response is in the same language as the question
    let finalResponse = openaiResponse
    
    // Detect user's language from the question
    const isEnglish = /^[a-zA-Z\s\?\.\,\!\-\'\"]+$/.test(message.trim())
    const isTurkish = /[çğıöşüÇĞIÖŞÜ]/.test(message) || 
                     message.toLowerCase().includes('nasıl') || 
                     message.toLowerCase().includes('nedir') ||
                     message.toLowerCase().includes('hakkında')
    
    // Check if response is in wrong language and fix it
    if (isEnglish && !/^[a-zA-Z\s\?\.\,\!\-\'\"]+$/.test(openaiResponse.trim())) {
      // Force English response
      const englishSystemMessage = {
        role: 'system' as const,
        content: `You are TAAI Agent. The user asked in English: "${message}". You MUST respond ONLY in English. Rewrite this response in English: ${openaiResponse}`
      }
      
      const englishCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [englishSystemMessage],
        max_tokens: 600,
        temperature: 0.3,
      })
      
      finalResponse = englishCompletion.choices[0]?.message?.content || openaiResponse
    } else if (isTurkish && !/[çğıöşüÇĞIÖŞÜ]/.test(openaiResponse)) {
      // Force Turkish response
      const turkishSystemMessage = {
        role: 'system' as const,
        content: `Sen TAAI Agent'sın. Kullanıcı Türkçe sordu: "${message}". Sadece Türkçe cevap ver. Bu cevabı Türkçe'ye çevir: ${openaiResponse}`
      }
      
      const turkishCompletion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [turkishSystemMessage],
        max_tokens: 600,
        temperature: 0.3,
      })
      
      finalResponse = turkishCompletion.choices[0]?.message?.content || openaiResponse
    }

    // If it's a crypto question, add the special message
    
    if (isCryptoQuestion) {
      // Detect language and provide appropriate message
      const isTurkish = /[çğıöşüÇĞIÖŞÜ]/.test(message) || 
                       message.toLowerCase().includes('nasıl') || 
                       message.toLowerCase().includes('nedir') ||
                       message.toLowerCase().includes('hakkında')
      
      const specialMessage = isTurkish 
        ? `Merhaba ben TAAI Agent! Şuan gelişim aşamasındayım ve henüz spesifik token analizleri yapamıyorum. Bunun için şimdilik sizlere istediğiniz tokenin genel teknik analizinizi yapabileceğiniz bilgileri paylaşacağım. Bunları kullanarak gerçek zamanlı grafik üzerinde analiz yapabilirsiniz.\n\n`
        : `Hello, I'm TAAI Agent! I'm currently in development and cannot yet perform specific token analysis. For now, I'll share information with you that you can use to perform general technical analysis of your desired token. You can use these to analyze on real-time charts.\n\n`
      
      finalResponse = specialMessage + openaiResponse
    }

    // Cache the response
    responseCache.set(cacheKey, {
      response: finalResponse,
      timestamp: Date.now()
    })

    // Clean up old cache entries (keep only last 100)
    if (responseCache.size > 100) {
      const entries = Array.from(responseCache.entries())
      entries.sort((a, b) => b[1].timestamp - a[1].timestamp)
      entries.slice(100).forEach(([key]) => responseCache.delete(key))
    }

    return NextResponse.json({ response: finalResponse })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
