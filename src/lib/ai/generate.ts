import OpenAI from 'openai'
import {
  executiveSummaryPrompt,
  keyHighlightsPrompt,
  issuesResolvedPrompt,
  weeklySummaryPrompt,
  futurePlansPrompt,
} from './prompts'
import type { CommitClassification } from './classify'

function getClient(apiKey?: string) {
  return new OpenAI({
    apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY!,
    baseURL: process.env.TOKENROUTER_BASE_URL ?? 'https://tokenrouter.io/v1',
  })
}

async function ask(client: OpenAI, prompt: string): Promise<string> {
  const res = await client.chat.completions.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    temperature: 0.3,
    messages: [{ role: 'user', content: prompt }],
  })
  return res.choices[0]?.message?.content ?? ''
}

function parseJson<T>(text: string): T {
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as T
}

function getWeekRanges(startDate: string, endDate: string): string[] {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const weeks: string[] = []
  let current = new Date(start)
  let weekNum = 1
  while (current <= end) {
    const weekEnd = new Date(current)
    weekEnd.setDate(weekEnd.getDate() + 6)
    if (weekEnd > end) weekEnd.setTime(end.getTime())
    weeks.push(`Week ${weekNum}: ${current.toISOString().split('T')[0]} – ${weekEnd.toISOString().split('T')[0]}`)
    current.setDate(current.getDate() + 7)
    weekNum++
  }
  return weeks
}

export async function generateSections(
  sections: string[],
  classifications: CommitClassification[],
  startDate: string,
  endDate: string,
  futurePlansInput?: string,
  apiKey?: string,
  language = 'id'
): Promise<Record<string, unknown>> {
  const client = getClient(apiKey)
  const content: Record<string, unknown> = {}

  const tasks = sections.map(async (section) => {
    if (section === 'executive_summary') {
      const text = await ask(client, executiveSummaryPrompt(classifications, startDate, endDate, language))
      content[section] = text.trim()
    } else if (section === 'key_highlights') {
      const text = await ask(client, keyHighlightsPrompt(classifications, language))
      content[section] = parseJson(text)
    } else if (section === 'issues_resolved') {
      const text = await ask(client, issuesResolvedPrompt(classifications, language))
      content[section] = parseJson(text)
    } else if (section === 'weekly_summary') {
      const weeks = getWeekRanges(startDate, endDate)
      const text = await ask(client, weeklySummaryPrompt(classifications, weeks, language))
      content[section] = parseJson(text)
    } else if (section === 'future_plans' && futurePlansInput) {
      const text = await ask(client, futurePlansPrompt(futurePlansInput, language))
      content[section] = parseJson(text)
    }
  })

  await Promise.allSettled(tasks)
  return content
}
