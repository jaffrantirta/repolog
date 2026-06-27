'use client'

const SECTION_LABELS: Record<string, { label: string; desc: string; locked?: boolean }> = {
  kop: { label: 'report header', desc: 'company logo, report title', locked: true },
  periode: { label: 'period', desc: 'report date range', locked: true },
  highlight_stats: { label: 'highlight stats', desc: 'feature/bug/improvement counts', locked: true },
  executive_summary: { label: 'executive summary', desc: 'ai-generated overview paragraph' },
  key_highlights: { label: 'key highlights', desc: 'top features and improvements' },
  issues_resolved: { label: 'issues resolved', desc: 'bug fixes and problems solved' },
  weekly_summary: { label: 'weekly summary', desc: 'week-by-week breakdown' },
  future_plans: { label: 'future plans', desc: 'planned work (you provide notes, ai polishes)' },
  developer_info: { label: 'developer info', desc: 'your profile and signature', locked: true },
}

export default function SectionToggle({ sections, onChange }: { sections: string[]; onChange: (v: string[]) => void }) {
  function toggle(key: string) {
    const meta = SECTION_LABELS[key]
    if (meta?.locked) return
    onChange(sections.includes(key) ? sections.filter(s => s !== key) : [...sections, key])
  }

  return (
    <div className="space-y-0 divide-y divide-[#0f0f0f] font-mono">
      {Object.entries(SECTION_LABELS).map(([key, { label, desc, locked }]) => {
        const on = sections.includes(key)
        return (
          <div
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-start gap-2.5 px-2 py-2.5 transition-colors ${
              locked ? 'opacity-40 cursor-default' : 'cursor-pointer hover:bg-[#0f0f0f]'
            }`}
          >
            <span className={`text-xs flex-shrink-0 w-6 text-center mt-0.5 ${on ? 'text-green-500' : 'text-[#2a2a2a]'}`}>
              {locked ? '[·]' : on ? '[x]' : '[ ]'}
            </span>
            <div className="min-w-0">
              <p className={`text-xs ${on ? 'text-[#ccc]' : 'text-[#555]'}`}>
                {on && !locked && <span className="text-green-700 mr-1">→</span>}
                {label}
                {locked && <span className="ml-1.5 text-[#222]">--required</span>}
              </p>
              <p className="text-xs text-[#333] mt-0.5">{desc}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
