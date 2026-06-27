'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import RepoSelector from '@/components/report/RepoSelector'
import SectionToggle from '@/components/report/SectionToggle'
import TerminalLoader, { type TerminalStep } from '@/components/TerminalLoader'
import Link from 'next/link'

const DEFAULT_SECTIONS = ['kop', 'periode', 'highlight_stats', 'executive_summary', 'key_highlights', 'issues_resolved', 'weekly_summary', 'developer_info']

type Step = 'repos' | 'dates' | 'sections' | 'review'

const STEP_LABELS: Record<Step, string> = {
  repos: '01 · repos',
  dates: '02 · dates',
  sections: '03 · sections',
  review: '04 · review',
}

const LANGUAGES = [
  { value: 'id', label: 'bahasa indonesia' },
  { value: 'en', label: 'english' },
]

function buildTerminalSteps(sections: string[]): TerminalStep[] {
  const steps: TerminalStep[] = [
    { id: 'init', label: 'initializing' },
    { id: 'commits', label: 'fetching commits from github' },
    { id: 'classify', label: 'classifying commits with AI' },
  ]
  if (sections.includes('executive_summary')) steps.push({ id: 'executive_summary', label: 'generating executive summary' })
  if (sections.includes('key_highlights')) steps.push({ id: 'key_highlights', label: 'generating key highlights' })
  if (sections.includes('issues_resolved')) steps.push({ id: 'issues_resolved', label: 'generating issues resolved' })
  if (sections.includes('weekly_summary')) steps.push({ id: 'weekly_summary', label: 'generating weekly summary' })
  if (sections.includes('future_plans')) steps.push({ id: 'future_plans', label: 'polishing future plans' })
  steps.push({ id: 'save', label: 'saving report' })
  return steps
}

export default function NewReportPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('repos')
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [repoAliases, setRepoAliases] = useState<Record<string, string>>({})
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [sections, setSections] = useState<string[]>(DEFAULT_SECTIONS)
  const [language, setLanguage] = useState('id')
  const [title, setTitle] = useState('')
  const [futurePlansInput, setFuturePlansInput] = useState('')
  const [error, setError] = useState('')

  const [generating, setGenerating] = useState(false)
  const [terminalStep, setTerminalStep] = useState<string | null>('init')
  const [elapsedMs, setElapsedMs] = useState(0)
  const [reportId, setReportId] = useState('')
  const startTimeRef = useRef<number>(0)
  const cosmeticTimersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const steps: Step[] = ['repos', 'dates', 'sections', 'review']
  const stepIdx = steps.indexOf(step)

  useEffect(() => {
    if (!generating) return
    startTimeRef.current = Date.now()
    const t = setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 200)
    return () => clearInterval(t)
  }, [generating])

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
        const msg = (data.generatedContent as { error?: string } | null)?.error ?? 'generation failed'
        setGenerating(false)
        setError(msg)
        clearInterval(id)
      }
    }, 3000)
    return () => clearInterval(id)
  }, [generating, reportId, router])

  useEffect(() => {
    if (!generating) return
    const terminalSteps = buildTerminalSteps(sections)
    const schedule: [string, number][] = [
      ['init', 0], ['commits', 800], ['classify', 3000],
    ]
    let offset = 12000
    for (const s of terminalSteps) {
      if (!['init', 'commits', 'classify'].includes(s.id)) {
        schedule.push([s.id, offset])
        offset += 7000
      }
    }
    schedule.push(['save', offset])
    const timers = schedule.map(([id, delay]) => setTimeout(() => setTerminalStep(id), delay))
    cosmeticTimersRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [generating, sections])

  async function handleSubmit() {
    if (!title || !selectedRepos.length || !startDate || !endDate) {
      setError('please fill in all required fields')
      return
    }
    setError('')
    setGenerating(true)
    setElapsedMs(0)
    setTerminalStep('init')
    try {
      setTerminalStep('commits')
      const commitsRes = await fetch('/api/github/commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repos: selectedRepos, startDate, endDate }),
      })
      if (!commitsRes.ok) throw new Error('failed to fetch commits')
      const { commits, error: commitErr } = await commitsRes.json()
      if (commitErr) throw new Error(commitErr)

      const createRes = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, startDate, endDate, repos: selectedRepos, repoAliases, sections, language, futurePlansInput }),
      })
      if (!createRes.ok) throw new Error('failed to create report')
      const { reportId: newReportId } = await createRes.json()
      setReportId(newReportId)

      fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: newReportId, commits }),
      })
    } catch (e) {
      setGenerating(false)
      setError(e instanceof Error ? e.message : 'something went wrong. please try again.')
    }
  }

  const inputClass = 'w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded px-3 py-2 text-xs text-[#aaa] placeholder-[#333] focus:outline-none focus:border-[#2a2a2a] font-mono [color-scheme:dark]'
  const labelClass = 'text-xs text-[#444] mb-1.5 block'

  if (generating) {
    return (
      <div className="max-w-2xl space-y-4 font-mono">
        <div>
          <p className="text-xs text-[#444] mb-1">$ repolog generate --report &quot;{title.toLowerCase()}&quot;</p>
          <p className="text-xs text-[#333]">hang tight — your report is being created</p>
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
    <div className="max-w-2xl space-y-6 font-mono">
      {/* Header */}
      <div>
        <p className="text-xs text-[#444] mb-1">
          <Link href="/dashboard" className="hover:text-[#666] transition-colors">$ dashboard</Link>
          <span className="mx-1.5 text-[#2a2a2a]">/</span>
          <span className="text-[#555]">new report</span>
        </p>
        <p className="text-xs text-[#333]">configure and generate a new it report</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 border border-[#1a1a1a] rounded p-1">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => i < stepIdx && setStep(s)}
            className={`flex-1 py-1.5 rounded text-xs transition-colors ${
              i === stepIdx
                ? 'bg-[#1a1a1a] text-white'
                : i < stepIdx
                ? 'text-green-600 hover:text-green-400 cursor-pointer'
                : 'text-[#333] cursor-default'
            }`}
          >
            {i < stepIdx ? '✓ ' : ''}{STEP_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        {step === 'repos' && (
          <>
            <p className="text-xs text-[#444]"># select repositories to include</p>
            <RepoSelector selected={selectedRepos} onChange={setSelectedRepos} aliases={repoAliases} onAliasChange={setRepoAliases} />
          </>
        )}

        {step === 'dates' && (
          <>
            <p className="text-xs text-[#444]"># set date range and report title</p>

            {/* Presets */}
            <div>
              <p className={labelClass}>quick presets</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: '--last-30-days', fn: () => { const e = new Date(); const s = new Date(); s.setDate(s.getDate() - 30); return [s, e] } },
                  { label: '--this-month', fn: () => { const n = new Date(); return [new Date(n.getFullYear(), n.getMonth(), 1), n] } },
                  { label: '--last-3-months', fn: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 3); return [s, e] } },
                  { label: '--last-6-months', fn: () => { const e = new Date(); const s = new Date(); s.setMonth(s.getMonth() - 6); return [s, e] } },
                  { label: '--this-year', fn: () => { const n = new Date(); return [new Date(n.getFullYear(), 0, 1), n] } },
                ].map(preset => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const [s, e] = preset.fn()
                      setStartDate((s as Date).toISOString().slice(0, 10))
                      setEndDate((e as Date).toISOString().slice(0, 10))
                    }}
                    className="px-2.5 py-1 rounded text-xs text-[#444] border border-[#1a1a1a] hover:text-green-400 hover:border-green-900 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>start date</label>
                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>end date</label>
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClass} />
              </div>
            </div>

            <div>
              <label className={labelClass}>report title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="laporan perkembangan it - juni 2026"
                className={inputClass}
              />
            </div>
          </>
        )}

        {step === 'sections' && (
          <>
            <p className="text-xs text-[#444]"># choose which sections to include</p>
            <SectionToggle sections={sections} onChange={setSections} />
            {sections.includes('future_plans') && (
              <div>
                <label className={labelClass}>future plans — rough notes, ai will polish</label>
                <textarea
                  value={futurePlansInput}
                  onChange={e => setFuturePlansInput(e.target.value)}
                  placeholder={"- add mobile app\n- improve dashboard performance\n- integrate whatsapp notifications"}
                  rows={4}
                  className={`${inputClass} resize-none`}
                />
              </div>
            )}
          </>
        )}

        {step === 'review' && (
          <>
            <p className="text-xs text-[#444]"># review configuration before generating</p>
            <div className="space-y-0 divide-y divide-[#111]">
              {[
                { key: 'title', val: title.toLowerCase() || '—' },
                { key: 'repositories', val: `${selectedRepos.length} selected` },
                { key: 'period', val: `${startDate} → ${endDate}` },
                { key: 'sections', val: `${sections.length} sections` },
              ].map(row => (
                <div key={row.key} className="flex justify-between py-2.5">
                  <span className="text-xs text-[#444]">{row.key}</span>
                  <span className="text-xs text-[#888]">{row.val}</span>
                </div>
              ))}
              <div className="flex justify-between items-center py-2.5">
                <span className="text-xs text-[#444]">language</span>
                <div className="flex gap-1.5">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.value}
                      onClick={() => setLanguage(l.value)}
                      className={`px-2.5 py-1 rounded text-xs transition-colors ${
                        language === l.value
                          ? 'bg-[#1a1a1a] border border-[#333] text-white'
                          : 'text-[#444] border border-[#1a1a1a] hover:text-[#666]'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {error && <p className="text-xs text-red-500 pt-1">&gt; error: {error}</p>}
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => stepIdx > 0 && setStep(steps[stepIdx - 1])}
          disabled={stepIdx === 0}
          className="px-3 py-1.5 rounded text-xs text-[#444] border border-[#1a1a1a] hover:text-[#666] hover:border-[#2a2a2a] transition-colors disabled:opacity-20"
        >
          ← back
        </button>
        {step !== 'review' ? (
          <button
            onClick={() => setStep(steps[stepIdx + 1])}
            className="px-4 py-1.5 rounded text-xs font-bold bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] hover:text-white hover:border-[#444] transition-colors"
          >
            next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded text-xs font-bold bg-[#1a1a1a] border border-green-900 text-green-400 hover:bg-green-950 hover:border-green-700 transition-colors"
          >
            $ generate report →
          </button>
        )}
      </div>
    </div>
  )
}
