import OpenAI from 'openai'
import { CLASSIFY_SYSTEM, classifyPrompt } from './prompts'

// Vercel kills the function at 300s; classify + generate run as two phases,
// so cap each call well under half that and fail into the catch instead of hanging.
export function getClient(apiKey?: string) {
  return new OpenAI({
    apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY!,
    baseURL: process.env.TOKENROUTER_BASE_URL ?? 'https://tokenrouter.io/v1',
    timeout: 120_000,
    maxRetries: 0,
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

  const batches: object[][] = []
  for (let i = 0; i < commits.length; i += BATCH_SIZE) batches.push(commits.slice(i, i + BATCH_SIZE))

  // ponytail: all batches in parallel, add a concurrency cap if the provider rate-limits
  const results = await Promise.all(batches.map(async (batch) => {
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
    return JSON.parse(clean) as ClassificationResult
  }))

  for (const result of results) {
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
