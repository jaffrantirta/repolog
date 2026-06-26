import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [report] = await db
    .select({ status: reports.status, generatedContent: reports.generatedContent })
    .from(reports)
    .where(and(eq(reports.id, id), eq(reports.userId, session.user.id)))

  if (!report) return NextResponse.json({ error: 'not found' }, { status: 404 })
  return NextResponse.json(report)
}
