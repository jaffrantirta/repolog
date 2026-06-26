import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { reports, developerProfiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { renderToBuffer } from '@react-pdf/renderer'
import { ReportDocument } from '@/lib/pdf/template'
import { headers } from 'next/headers'
import React from 'react'

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'missing id' }, { status: 400 })

  const [report] = await db.select().from(reports).where(and(eq(reports.id, id), eq(reports.userId, session.user.id)))
  if (!report || !report.generatedContent) return NextResponse.json({ error: 'not found' }, { status: 404 })

  const [profile] = await db.select().from(developerProfiles).where(eq(developerProfiles.userId, session.user.id))

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(ReportDocument as any, {
    report: {
      title: report.title,
      startDate: report.startDate,
      endDate: report.endDate,
      sections: report.sections,
    },
    profile: profile ? { name: profile.name, email: profile.email, position: profile.position, company: profile.company } : null,
    content: report.generatedContent as Record<string, unknown>,
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(element as any)

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${report.title}.pdf"`,
    },
  })
}
