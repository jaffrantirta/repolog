'use client'

const SECTION_LABELS: Record<string, { label: string; desc: string; locked?: boolean }> = {
  kop: { label: 'Report Header (Kop)', desc: 'Company logo, report title', locked: true },
  periode: { label: 'Period', desc: 'Report date range', locked: true },
  highlight_stats: { label: 'Highlight Stats', desc: 'Feature/bug/improvement counts', locked: true },
  executive_summary: { label: 'Executive Summary', desc: 'AI-generated overview paragraph' },
  key_highlights: { label: 'Key Highlights', desc: 'Top features and improvements' },
  issues_resolved: { label: 'Issues Resolved', desc: 'Bug fixes and problems solved' },
  weekly_summary: { label: 'Weekly Summary', desc: 'Week-by-week breakdown' },
  future_plans: { label: 'Future Plans', desc: 'Planned work (you provide notes, AI polishes)' },
  developer_info: { label: 'Developer Info', desc: 'Your profile and signature', locked: true },
}

export default function SectionToggle({ sections, onChange }: { sections: string[]; onChange: (v: string[]) => void }) {
  function toggle(key: string) {
    const meta = SECTION_LABELS[key]
    if (meta?.locked) return
    onChange(sections.includes(key) ? sections.filter(s => s !== key) : [...sections, key])
  }

  return (
    <div className="space-y-2">
      {Object.entries(SECTION_LABELS).map(([key, { label, desc, locked }]) => {
        const on = sections.includes(key)
        return (
          <div
            key={key}
            onClick={() => toggle(key)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${locked ? 'opacity-60 cursor-default' : 'hover:bg-[#1a1a1a]'}`}
          >
            <div className={`w-8 h-5 rounded-full flex items-center transition-colors flex-shrink-0 ${on ? 'bg-white' : 'bg-[#333]'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-[#0a0a0a] transition-transform mx-0.5 ${on ? 'translate-x-2.5' : 'translate-x-0'}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-[#666]">{desc}{locked ? ' · always included' : ''}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
