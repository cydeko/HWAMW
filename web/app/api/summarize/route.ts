import { NextRequest, NextResponse } from 'next/server'
import { ollamaChat } from '@/lib/ollama'

export async function POST(req: NextRequest) {
  const { narrative } = await req.json()

  const summary = await ollamaChat([
    {
      role: 'system',
      content: `You are a careful reader. Given a personal narrative, produce:
1. A brief plot summary (2-3 sentences, third person)
2. A list of the key people mentioned (first names or descriptors only, max 5)

Respond in JSON: { "summary": "...", "characters": ["name1", "name2"] }`,
    },
    { role: 'user', content: narrative },
  ])

  try {
    const json = JSON.parse(summary.trim())
    return NextResponse.json(json)
  } catch {
    return NextResponse.json({ summary, characters: [] })
  }
}
