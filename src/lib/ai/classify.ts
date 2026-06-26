import OpenAI from 'openai'
import { CLASSIFY_SYSTEM, classifyPrompt } from './prompts'

function getClient(apiKey?: string) {
  return new OpenAI({
    apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY!,
    baseURL: process.env.TOKENROUTER_BASE_URL ?? 'https://tokenrouter.io/v1',
  })
}

export interface CommitClassification {
  hash: string
  date: string
  repo: string
  message: string
  category: 'FEATURE' | 'BUGFIX' | 'IMPROVEMENT' | 'CHORE'
  plain_description: string
}

export interface ClassificationResult {
  classifications: CommitClassification[]
  summary: {
    feature_count: number
    bugfix_count: number
    improvement_count: number
    chore_count: number
    systems_updated: string[]
    uptime_note: string
  }
}

const BATCH_SIZE = 40

export async function classifyCommits(commits: object[], apiKey?: string, language = 'id'): Promise<ClassificationResult> {
  const client = getClient(apiKey)

  const allClassifications: CommitClassification[] = []
  const systemsUpdated = new Set<string>()
  let featureCount = 0, bugfixCount = 0, improvementCount = 0, choreCount = 0

  for (let i = 0; i < commits.length; i += BATCH_SIZE) {
    const batch = commits.slice(i, i + BATCH_SIZE)

    const response = await client.chat.completions.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      temperature: 0,
      messages: [
        { role: 'system', content: CLASSIFY_SYSTEM },
        { role: 'user', content: classifyPrompt(batch, language) },
      ],
    })

    const text = response.choices[0]?.message?.content ?? ''
    const clean = text.replace(/```json|```/g, '').trim()
    const result = JSON.parse(clean) as ClassificationResult

    allClassifications.push(...result.classifications)
    featureCount += result.summary.feature_count
    bugfixCount += result.summary.bugfix_count
    improvementCount += result.summary.improvement_count
    choreCount += result.summary.chore_count
    result.summary.systems_updated.forEach(s => systemsUpdated.add(s))
  }

  return {
    classifications: allClassifications,
    summary: {
      feature_count: featureCount,
      bugfix_count: bugfixCount,
      improvement_count: improvementCount,
      chore_count: choreCount,
      systems_updated: Array.from(systemsUpdated),
      uptime_note: '100%',
    },
  }
}
