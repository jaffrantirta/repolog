import type { InferSelectModel } from 'drizzle-orm'
import type { reports, developerProfiles } from '@/lib/db/schema'

type Report = InferSelectModel<typeof reports>
type Profile = InferSelectModel<typeof developerProfiles> | null

interface KeyHighlight { title: string; system: string; description: string }
interface IssueResolved { number: number; description: string; system: string; resolved_date: string }
interface WeekSummary { week: string; period: string; focus: string; summary: string; status: string }
interface FuturePlan { priority: string; title: string; description: string; expected_benefit: string }

export default function ReportPreview({ report, profile, content }: { report: Report; profile: Profile; content: Record<string, unknown> }) {
  const summary = content.summary as { feature_count: number; bugfix_count: number; improvement_count: number; chore_count: number; systems_updated: string[] } | undefined
  const sections = report.sections as string[]

  return (
    <div className="bg-white text-[#1a1a1a] rounded-2xl overflow-hidden shadow-2xl">
      {/* KOP */}
      <div className="bg-[#1a1a2e] px-8 py-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{report.title}</h1>
            <p className="text-[#8888aa] text-sm mt-1">{profile?.company || 'Nama Perusahaan'}</p>
          </div>
          <div className="text-right text-sm text-[#8888aa]">
            <p>Dibuat: {new Date(report.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p className="mt-1">Periode: {report.startDate} – {report.endDate}</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-8 space-y-8">
        {/* Highlight Stats */}
        {sections.includes('highlight_stats') && summary != null && (
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Fitur Baru', value: summary.feature_count, color: '#3b82f6' },
              { label: 'Bug Diperbaiki', value: summary.bugfix_count, color: '#22c55e' },
              { label: 'Peningkatan', value: summary.improvement_count, color: '#f59e0b' },
              { label: 'Pemeliharaan', value: summary.chore_count, color: '#8b5cf6' },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-[#f8f8f8] rounded-xl p-4 text-center">
                <p className="text-3xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs text-[#666] mt-1">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Executive Summary */}
        {sections.includes('executive_summary') && content.executive_summary != null && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-[#1a1a2e] pb-2 mb-4">Ringkasan Eksekutif</h2>
            <p className="text-sm leading-relaxed text-[#333]">{content.executive_summary as string}</p>
          </section>
        )}

        {/* Key Highlights */}
        {sections.includes('key_highlights') && Array.isArray(content.key_highlights) && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-[#1a1a2e] pb-2 mb-4">Pencapaian Utama</h2>
            <div className="space-y-3">
              {(content.key_highlights as KeyHighlight[]).map((h, i) => (
                <div key={i} className="bg-[#f8f8f8] rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-sm">{h.title}</p>
                      <p className="text-xs text-[#666] mb-1">{h.system}</p>
                      <p className="text-sm text-[#444]">{h.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Issues Resolved */}
        {sections.includes('issues_resolved') && Array.isArray(content.issues_resolved) && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-[#1a1a2e] pb-2 mb-4">Permasalahan Terselesaikan</h2>
            <div className="space-y-2">
              {(content.issues_resolved as IssueResolved[]).map((issue, i) => (
                <div key={i} className="flex gap-4 py-2 border-b border-[#eee] last:border-0">
                  <span className="text-sm font-bold text-[#1a1a2e] flex-shrink-0">#{issue.number || i + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm">{issue.description}</p>
                    <p className="text-xs text-[#888] mt-0.5">{issue.system} · {issue.resolved_date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Weekly Summary */}
        {sections.includes('weekly_summary') && Array.isArray(content.weekly_summary) && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-[#1a1a2e] pb-2 mb-4">Ringkasan Mingguan</h2>
            <div className="space-y-3">
              {(content.weekly_summary as WeekSummary[]).map((week, i) => (
                <div key={i} className="bg-[#f8f8f8] rounded-xl p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm">{week.week} — {week.focus}</p>
                    <span className="text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">{week.status}</span>
                  </div>
                  <p className="text-xs text-[#666] mb-1">{week.period}</p>
                  <p className="text-sm text-[#444]">{week.summary}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Future Plans */}
        {sections.includes('future_plans') && Array.isArray(content.future_plans) && (
          <section>
            <h2 className="text-lg font-bold border-b-2 border-[#1a1a2e] pb-2 mb-4">Rencana ke Depan</h2>
            <div className="space-y-2">
              {(content.future_plans as FuturePlan[]).map((plan, i) => (
                <div key={i} className="flex gap-4 py-3 border-b border-[#eee] last:border-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5 h-fit ${
                    plan.priority === 'High' ? 'bg-red-100 text-red-700' :
                    plan.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{plan.priority}</span>
                  <div>
                    <p className="text-sm font-semibold">{plan.title}</p>
                    <p className="text-sm text-[#444] mt-0.5">{plan.description}</p>
                    <p className="text-xs text-[#888] mt-1">Manfaat: {plan.expected_benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Developer Info */}
        {sections.includes('developer_info') && (
          <section className="border-t-2 border-[#1a1a2e] pt-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-bold">{profile?.name || 'Nama Developer'}</p>
                <p className="text-xs text-[#666]">{profile?.position || 'Posisi'}</p>
                <p className="text-xs text-[#666]">{profile?.email || 'Email'}</p>
              </div>
              <div className="text-right text-xs text-[#888]">
                <p>Sistem Terupdate:</p>
                {(content.summary as { systems_updated: string[] } | undefined)?.systems_updated?.map((s, i) => (
                  <p key={i} className="font-medium text-[#1a1a2e]">{s}</p>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
