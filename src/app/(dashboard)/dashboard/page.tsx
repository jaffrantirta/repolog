import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
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

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const allReports = await getReportsCached(session!.user.id)
  const recent = allReports.slice(0, 8)

  const total = allReports.length
  const done = allReports.filter(r => r.status === 'done').length
  const running = allReports.filter(r => r.status === 'generating' || r.status === 'draft').length
  const errors = allReports.filter(r => r.status === 'error').length
  const lastDone = allReports.find(r => r.status === 'done')
  const donePercent = total > 0 ? Math.round((done / total) * 100) : 0
  const barFilled = Math.round(donePercent / 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#444] mb-1">
            <span className="text-[#333]">$</span> repolog status --user {session?.user.name?.toLowerCase().replace(/\s+/g, '-')}
          </p>
          <h1 className="text-sm text-[#666]">
            welcome back, <span className="text-white">{session?.user.name?.toLowerCase()}</span>
          </h1>
        </div>
        <Link
          href="/reports/new"
          className="px-3 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] rounded text-xs hover:border-green-900 hover:text-green-400 transition-colors"
        >
          $ generate new →
        </Link>
      </div>

      {/* Stats */}
      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        <p className="text-xs text-[#444]"># overview</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'total', value: total, color: 'text-[#aaa]' },
            { label: 'done', value: done, color: 'text-green-500' },
            { label: 'running', value: running, color: 'text-yellow-500' },
            { label: 'errors', value: errors, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label}>
              <p className="text-xs text-[#444] mb-0.5">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
        {total > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-[#444]">
              <span>completion rate</span>
              <span className="text-green-600">{donePercent}%</span>
            </div>
            <div className="text-xs text-[#333] tracking-wider">
              {'█'.repeat(barFilled)}{'░'.repeat(20 - barFilled)}
            </div>
          </div>
        )}
      </div>

      {/* Last report */}
      {lastDone && (
        <div className="border border-[#1a1a1a] rounded p-5 space-y-3">
          <p className="text-xs text-[#444]"># last completed report</p>
          <Link
            href={`/reports/${lastDone.id}`}
            className="flex items-start justify-between group"
          >
            <div className="space-y-1">
              <p className="text-sm text-white group-hover:text-green-400 transition-colors">
                → {lastDone.title.toLowerCase()}
              </p>
              <p className="text-xs text-[#444]">
                {formatDate(lastDone.startDate, lastDone.language ?? 'id')} — {formatDate(lastDone.endDate, lastDone.language ?? 'id')}
                <span className="mx-2 text-[#2a2a2a]">·</span>
                {(lastDone.repos as string[]).length} repo{(lastDone.repos as string[]).length !== 1 ? 's' : ''}
                <span className="mx-2 text-[#2a2a2a]">·</span>
                {lastDone.language ?? 'id'}
              </p>
            </div>
            <span className="text-xs text-[#444] flex-shrink-0 ml-4">
              {formatDate(new Date(lastDone.createdAt).toISOString().slice(0, 10))}
            </span>
          </Link>
        </div>
      )}

      {/* Recent reports */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#444]"># recent reports</p>
          {allReports.length > 8 && (
            <Link href="/reports" className="text-xs text-[#444] hover:text-[#888] transition-colors">
              view all ({allReports.length}) →
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="border border-[#1a1a1a] rounded p-10 text-center space-y-3">
            <p className="text-xs text-[#333]">$ repolog list</p>
            <p className="text-xs text-[#444]">no reports found.</p>
            <Link href="/reports/new" className="text-xs text-[#555] hover:text-[#888] transition-colors underline">
              generate your first report →
            </Link>
          </div>
        ) : (
          <div className="border border-[#1a1a1a] rounded divide-y divide-[#111]">
            {recent.map((report) => (
              <Link
                key={report.id}
                href={`/reports/${report.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#0d0d0d] transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[#333] group-hover:text-[#555] transition-colors text-xs flex-shrink-0">→</span>
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

      {/* Quick actions */}
      <div className="border border-[#1a1a1a] rounded p-5 space-y-3">
        <p className="text-xs text-[#444]"># quick actions</p>
        <div className="grid sm:grid-cols-3 gap-2">
          <Link
            href="/reports/new"
            className="px-3 py-2.5 border border-[#1a1a1a] rounded text-xs text-[#555] hover:border-green-900 hover:text-green-400 transition-colors"
          >
            $ generate report
          </Link>
          <Link
            href="/reports"
            className="px-3 py-2.5 border border-[#1a1a1a] rounded text-xs text-[#555] hover:border-[#2a2a2a] hover:text-[#888] transition-colors"
          >
            $ list all reports
          </Link>
          <Link
            href="/settings"
            className="px-3 py-2.5 border border-[#1a1a1a] rounded text-xs text-[#555] hover:border-[#2a2a2a] hover:text-[#888] transition-colors"
          >
            $ edit profile
          </Link>
        </div>
      </div>
    </div>
  )
}
