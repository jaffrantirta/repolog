import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ReportStatus from './ReportStatus'
import { formatDate } from '@/lib/utils'
import { getReportCached, getProfileCached } from '@/lib/data'

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth.api.getSession({ headers: await headers() })

  const [report, profile] = await Promise.all([
    getReportCached(id, session!.user.id),
    getProfileCached(session!.user.id),
  ])
  if (!report) notFound()

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs text-[#444] mb-3">
          <Link href="/reports" className="hover:text-[#666] transition-colors">$ reports</Link>
          <span className="mx-1.5 text-[#2a2a2a]">/</span>
          <span className="text-[#555]">{report.title.toLowerCase()}</span>
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-sm font-bold text-white">{report.title.toLowerCase()}</h1>
            <p className="text-xs text-[#444] mt-1">
              {formatDate(report.startDate, report.language ?? 'id')} — {formatDate(report.endDate, report.language ?? 'id')}
              <span className="mx-1.5">·</span>
              {(report.repos as string[]).length} repo{(report.repos as string[]).length !== 1 ? 's' : ''}
              <span className="mx-1.5">·</span>
              {report.language ?? 'id'}
            </p>
          </div>
        </div>
      </div>

      <ReportStatus report={report} profile={profile ?? null} />
    </div>
  )
}
