import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { getReportsCached } from '@/lib/data'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    done: 'text-green-500',
    generating: 'text-yellow-500',
    error: 'text-red-500',
    draft: 'text-[#444]',
  }
  return <span className={`text-xs ${styles[status] ?? 'text-[#444]'}`}>[{status}]</span>
}

export default async function ReportsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const allReports = await getReportsCached(session!.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#444] mb-1">
            <span className="text-[#333]">$</span> repolog list --all
          </p>
          <p className="text-xs text-[#555]">{allReports.length} report{allReports.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link
          href="/reports/new"
          className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] rounded text-xs hover:border-green-900 hover:text-green-400 transition-colors"
        >
          $ generate new →
        </Link>
      </div>

      {allReports.length === 0 ? (
        <div className="border border-[#1a1a1a] rounded p-12 text-center space-y-3">
          <p className="text-xs text-[#333]">$ repolog list</p>
          <p className="text-xs text-[#444]">no reports yet.</p>
          <Link href="/reports/new" className="text-xs text-[#555] hover:text-[#888] transition-colors underline">
            generate your first report →
          </Link>
        </div>
      ) : (
        <div className="border border-[#1a1a1a] rounded divide-y divide-[#111]">
          {allReports.map(report => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="flex items-center justify-between px-4 py-3 hover:bg-[#0d0d0d] transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[#333] group-hover:text-[#555] text-xs flex-shrink-0">→</span>
                <div className="min-w-0">
                  <p className="text-xs text-[#888] group-hover:text-white transition-colors truncate">
                    {report.title.toLowerCase()}
                  </p>
                  <p className="text-xs text-[#333] mt-0.5">
                    {report.startDate} — {report.endDate}
                    <span className="mx-1.5">·</span>
                    {(report.repos as string[]).length} repo{(report.repos as string[]).length !== 1 ? 's' : ''}
                    <span className="mx-1.5">·</span>
                    {report.language ?? 'id'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                <StatusBadge status={report.status} />
                <span className="text-xs text-[#333]">
                  {new Date(report.createdAt).toISOString().slice(0, 10)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
