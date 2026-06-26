'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import RepoSelector from '@/components/report/RepoSelector'
import SectionToggle from '@/components/report/SectionToggle'
import TerminalLoader, { type TerminalStep } from '@/components/TerminalLoader'

const DEFAULT_SECTIONS = ['kop', 'periode', 'highlight_stats', 'executive_summary', 'key_highlights', 'issues_resolved', 'weekly_summary', 'developer_info']

type Step = 'repos' | 'dates' | 'sections' | 'review'

const LANGUAGES = [
  { value: 'id', label: 'Bahasa Indonesia', flag: '🇮🇩' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
]

function buildTerminalSteps(sections: string[]): TerminalStep[] {
  const steps: TerminalStep[] = [
    { id: 'init', label: 'Initializing' },
    { id: 'commits', label: 'Fetching commits from GitHub' },
    { id: 'classify', label: 'Classifying commits with AI' },
  ]
  if (sections.includes('executive_summary')) steps.push({ id: 'executive_summary', label: 'Generating executive summary' })
  if (sections.includes('key_highlights')) steps.push({ id: 'key_highlights', label: 'Generating key highlights' })
  if (sections.includes('issues_resolved')) steps.push({ id: 'issues_resolved', label: 'Generating issues resolved' })
  if (sections.includes('weekly_summary')) steps.push({ id: 'weekly_summary', label: 'Generating weekly summary' })
  if (sections.includes('future_plans')) steps.push({ id: 'future_plans', label: 'Polishing future plans' })
  steps.push({ id: 'save', label: 'Saving report' })
  return steps
}

export default function NewReportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('repos')
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS)
  const [language, setLanguage] = useState('id')
  const [title, setTitle] = useState('')
  const [futurePlansInput, setFuturePlansInput] = useState('')
  const [error, setError] = useState('')

  // Terminal loader state
  const [generating, setGenerating] = useState(false)
  const [terminalStep, setTerminalStep] = useState<string | null>('init')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [reportId, setReportId] = useState('')
  const startTimeRef = useRef<number>(0)
  const cosmeticTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const steps: Step[] = ['repos', 'dates', 'sections', 'review']
  const stepIdx = steps.indexOf(step)

  // Elapsed timer while generating
  useEffect(() => {
    if (!generating) return
    startTimeRef.current = Date.now()
    const t = setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 200)
    return () => clearInterval(t)
  }, [generating])

  // Poll for status while terminal is showing
  useEffect(() => {
    if (!generating || !reportId) return
    const id = setInterval(async () => {
      const res = await fetch(`/api/reports/${reportId}/status`)
      if (!res.ok) return
      const data = await res.json()
      if (data.status === 'done') {
        cosmeticTimersRef.current.forEach(clearTimeout)
        cosmeticTimersRef.current = []
        setTerminalStep(null)
        clearInterval(id)
        setTimeout(() => router.push(`/reports/${reportId}`), 1200)
      } else if (data.status === 'error') {
        cosmeticTimersRef.current.forEach(clearTimeout)
        cosmeticTimersRef.current = []
        const msg = (data.generatedContent as { error?: string } | null)?.error ?? 'Generation failed'
        setGenerating(false)
        setError(msg)
        clearInterval(id)
      }
    }, 3000)
    return () => clearInterval(id)
  }, [generating, reportId, router])

  // Animate terminal step advancement (cosmetic — time-based estimates)
  useEffect(() => {
    if (!generating) return
    const terminalSteps = buildTerminalSteps(sections)
    const schedule: [string, number][] = [
      ['init', 0],
      ['commits', 800],
      ['classify', 3000],
    ]
    let offset = 12000
    for (const s of terminalSteps) {
      if (!['init', 'commits', 'classify'].includes(s.id)) {
        schedule.push([s.id, offset])
        offset += 7000
      }
    }
    schedule.push(['save', offset])

    const timers = schedule.map(([id, delay]) =>
      setTimeout(() => setTerminalStep(id), delay)
    )
    cosmeticTimersRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [generating, sections])

  async function handleSubmit() {
    if (!title || !selectedRepos.length || !startDate || !endDate) {
      setError('Please fill in all required fields')
      return
    }
    setError('')
    setGenerating(true)
    setElapsedMs(0)
    setTerminalStep('init')

    try {
      // Fetch commits
      setTerminalStep('commits')
      const commitsRes = await fetch('/api/github/commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repos: selectedRepos, startDate, endDate }),
      })
      if (!commitsRes.ok) throw new Error('Failed to fetch commits')
      const { commits, error: commitErr } = await commitsRes.json()
      if (commitErr) throw new Error(commitErr)

      // Create report record
      const createRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, startDate, endDate, repos: selectedRepos, sections, language, futurePlansInput }),
      })
      if (!createRes.ok) throw new Error('Failed to create report')
      const { reportId: newReportId } = await createRes.json()
      setReportId(newReportId)

      // Fire generate non-blocking — polling above will handle completion
      fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: newReportId, commits }),
      })
    } catch (e) {
      setGenerating(false)
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
    }
  }

  // Show terminal overlay while generating
  if (generating) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div>
          <h1 className="text-xl font-bold">Generating Report</h1>
          <p className="text-[#666] text-sm mt-1">Hang tight — your report is being created</p>
        </div>
        <TerminalLoader
          title={title}
          steps={buildTerminalSteps(sections)}
          currentStep={terminalStep}
          elapsedMs={elapsedMs}
        />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-[#666] hover:text-white transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">New Report</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              i < stepIdx ? 'bg-green-500 text-white' :
              i === stepIdx ? 'bg-white text-black' :
              'bg-[#1a1a1a] border border-[#2a2a2a] text-[#555]'
            }`}>
              {i < stepIdx ? <Check size={12} /> : i + 1}
            </div>
            {i < steps.length - 1 && <div className={`h-px w-8 ${i < stepIdx ? 'bg-green-500' : 'bg-[#2a2a2a]'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-5">
        {step === 'repos' && (
          <>
            <h2 className="font-semibold text-lg">Select Repositories</h2>
            <RepoSelector selected={selectedRepos} onChange={setSelectedRepos} />
          </>
        )}

        {step === 'dates' && (
          <>
            <h2 className="font-semibold text-lg">Date Range</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Last 30 days', fn: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 30); return [s, e] } },
                { label: 'This month', fn: () => { const n = new Date(); return [new Date(n.getFullYear(), n.getMonth(), 1), n] } },
                { label: 'Last 3 months', fn: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 3); return [s, e] } },
                { label: 'Last 6 months', fn: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 6); return [s, e] } },
                { label: 'This year', fn: () => { const n = new Date(); return [new Date(n.getFullYear(), 0, 1), n] } },
              ].map(preset => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    const [s, e] = preset.fn()
                    setStartDate(s.toISOString().slice(0, 10))
                    setEndDate(e.toISOString().slice(0, 10))
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444] transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#666] mb-1.5 block">Start Date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white [color-scheme:dark]" />
              </div>
              <div>
                <label className="text-xs text-[#666] mb-1.5 block">End Date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white [color-scheme:dark]" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#666] mb-1.5 block">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Laporan Perkembangan IT - Juni 2025"
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#444]"
              />
            </div>
          </>
        )}

        {step === 'sections' && (
          <>
            <h2 className="font-semibold text-lg">Report Sections</h2>
            <SectionToggle sections={sections} onChange={setSections} />
            {sections.includes('future_plans') && (
              <div>
                <label className="text-xs text-[#666] mb-1.5 block">Future Plans (rough notes, AI will polish)</label>
                <textarea
                  value={futurePlansInput}
                  onChange={e => setFuturePlansInput(e.target.value)}
                  placeholder={"- Add mobile app\n- Improve dashboard performance\n- Integrate WhatsApp notifications"}
                  rows={4}
                  className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#444] resize-none"
                />
              </div>
            )}
          </>
        )}

        {step === 'review' && (
          <>
            <h2 className="font-semibold text-lg">Review & Generate</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                <span className="text-[#666]">Title</span>
                <span className="text-white font-medium">{title || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                <span className="text-[#666]">Repositories</span>
                <span className="text-white font-medium">{selectedRepos.length} repos</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                <span className="text-[#666]">Period</span>
                <span className="text-white font-medium">{startDate} — {endDate}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#1f1f1f]">
                <span className="text-[#666]">Sections</span>
                <span className="text-white font-medium">{sections.length} sections</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-[#666]">Report Language</span>
                <div className="flex gap-2">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.value}
                      onClick={() => setLanguage(l.value)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        language === l.value
                          ? 'bg-white text-black'
                          : 'bg-[#1a1a1a] text-[#666] border border-[#2a2a2a] hover:border-[#444]'
                      }`}
                    >
                      <span>{l.flag}</span>
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setStep(steps[stepIdx - 1])}
          disabled={stepIdx === 0}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-[#1a1a1a] border border-[#2a2a2a] text-[#666] hover:text-white transition-colors disabled:opacity-30"
        >
          Back
        </button>
        {step !== 'review' ? (
          <button
            onClick={() => setStep(steps[stepIdx + 1])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-[#e5e5e5] transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-semibold bg-white text-black hover:bg-[#e5e5e5] transition-colors"
          >
            ✨ Generate Report
          </button>
        )}
      </div>
    </div>
  )
}
