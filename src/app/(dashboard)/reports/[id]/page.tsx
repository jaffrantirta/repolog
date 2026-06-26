import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { reports, developerProfiles } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import ReportStatus from './ReportStatus'
import { formatDate } from '@/lib/utils'

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [report] = await db
    .select()
    .from(reports)
    .where(and(eq(reports.id, id), eq(reports.userId, session!.user.id)))
  if (!report) notFound()

  const [profile] = await db
    .select()
    .from(developerProfiles)
    .where(eq(developerProfiles.userId, session!.user.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="text-[#666] hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold">{report.title}</h1>
          <p className="text-[#666] text-sm">{formatDate(report.startDate, report.language ?? 'id')} — {formatDate(report.endDate, report.language ?? 'id')}</p>
        </div>
      </div>

      <ReportStatus report={report} profile={profile ?? null} />
    </div>
  )
}
