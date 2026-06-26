import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { reports } from '@/lib/db/schema'
import { eq, desc } from 'drizzle-orm'
import Link from 'next/link'
import { FileText, Plus } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userReports = await db
    .select()
    .from(reports)
    .where(eq(reports.userId, session!.user.id))
    .orderBy(desc(reports.createdAt))
    .limit(10)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-[#666] text-sm mt-1">Welcome back, {session?.user.name}</p>
        </div>
        <Link
          href="/reports/new"
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
        >
          <Plus size={16} /> New Report
        </Link>
      </div>

      {userReports.length === 0 ? (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-12 text-center">
          <FileText size={40} className="mx-auto text-[#333] mb-4" />
          <p className="text-[#666] text-sm">No reports yet.</p>
          <Link href="/reports/new" className="text-white text-sm underline mt-2 inline-block">
            Create your first report →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {userReports.map((report) => (
            <Link
              key={report.id}
              href={`/reports/${report.id}`}
              className="flex items-center justify-between bg-[#111] border border-[#1f1f1f] rounded-xl px-5 py-4 hover:border-[#333] transition-colors"
            >
              <div>
                <p className="font-medium text-white">{report.title}</p>
                <p className="text-xs text-[#666] mt-0.5">
                  {report.startDate} — {report.endDate}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${
                  report.status === 'done' ? 'bg-green-900/30 border-green-800 text-green-400' :
                  report.status === 'generating' ? 'bg-yellow-900/30 border-yellow-800 text-yellow-400' :
                  report.status === 'error' ? 'bg-red-900/30 border-red-800 text-red-400' :
                  'bg-[#1a1a1a] border-[#2a2a2a] text-[#666]'
                }`}>
                  {report.status}
                </span>
                <span className="text-xs text-[#444]">{formatDate(report.createdAt.toISOString().slice(0, 10))}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
