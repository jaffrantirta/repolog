import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { users, reports } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { classifyCommits } from '@/lib/ai/classify'
import { generateSections } from '@/lib/ai/generate'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { reportId, commits } = await req.json()

  const [user] = await db
    .select({ anthropicApiKey: users.anthropicApiKey })
    .from(users)
    .where(eq(users.id, session.user.id))

  // User's own key takes priority; fall back to server key if not set
  const apiKey = user?.anthropicApiKey ?? process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'No API key configured. Add your key in Settings.' }, { status: 400 })
  }

  const [report] = await db.select().from(reports).where(eq(reports.id, reportId))
  if (!report || report.userId !== session.user.id) {
    return NextResponse.json({ error: 'report not found' }, { status: 404 })
  }

  await db.update(reports).set({ status: 'generating' }).where(eq(reports.id, reportId))

  try {
    const language = report.language ?? 'id'
    const result = await classifyCommits(commits, apiKey, language)
    const sectionList = (report.sections as string[]).filter(s =>
      !['kop', 'periode', 'highlight_stats', 'developer_info'].includes(s)
    )
    const content = await generateSections(
      sectionList,
      result.classifications,
      report.startDate,
      report.endDate,
      report.futurePlansInput ?? undefined,
      apiKey,
      language
    )

    const generatedContent = {
      summary: result.summary,
      classifications: result.classifications,
      ...content,
    }

    await db.update(reports).set({ status: 'done', generatedContent, updatedAt: new Date() }).where(eq(reports.id, reportId))
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[generate]', err)
    await db.update(reports).set({
      status: 'error',
      generatedContent: { error: message },
    }).where(eq(reports.id, reportId))
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
