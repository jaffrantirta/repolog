import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const data = await db.select().from(reports).where(eq(reports.userId, session.user.id)).orderBy(desc(reports.createdAt))
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const [report] = await db.insert(reports).values({
    userId: session.user.id,
    title: body.title,
    startDate: body.startDate,
    endDate: body.endDate,
    repos: body.repos,
    repoAliases: body.repoAliases ?? {},
    sections: body.sections,
    language: body.language ?? 'id',
    futurePlansInput: body.futurePlansInput,
    status: 'draft',
  }).returning({ id: reports.id })
  revalidateTag(`reports-${session.user.id}`)
  return NextResponse.json({ reportId: report.id })
}
