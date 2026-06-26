import { NextRequest, NextResponse } from 'next/server'
import { classifyCommits } from '@/lib/ai/classify'
import { generateSections } from '@/lib/ai/generate'

export async function POST(req: NextRequest) {
  const { commits, sections } = await req.json()

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'Demo not available — ANTHROPIC_API_KEY not configured' }, { status: 503 })

  try {
    const result = await classifyCommits(commits, apiKey)
    const sectionList = (sections as string[]).filter(s => !['kop', 'periode', 'highlight_stats', 'developer_info'].includes(s))
    const generated = await generateSections(sectionList, result.classifications, '2025-06-01', '2025-06-30', undefined, apiKey)

    return NextResponse.json({
      content: {
        summary: result.summary,
        classifications: result.classifications,
        ...generated,
      },
    })
  } catch (err) {
    console.error('[demo/generate]', err)
    return NextResponse.json({ error: 'Generation failed. Check server logs.' }, { status: 500 })
  }
}
