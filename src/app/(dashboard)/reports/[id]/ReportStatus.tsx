'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ReportPreview from '@/components/report/ReportPreview'
import ExportButton from '@/components/report/ExportButton'
import TerminalLoader, { type TerminalStep } from '@/components/TerminalLoader'
import type { InferSelectModel } from 'drizzle-orm'
import type { reports, developerProfiles } from '@/lib/db/schema'

type Report = InferSelectModel<typeof reports>
type Profile = InferSelectModel<typeof developerProfiles> | null

export default function ReportStatus({ report, profile }: { report: Report; profile: Profile }) {
  const router = useRouter()
  const [status, setStatus] = useState(report.status)
  const [content, setContent] = useState(report.generatedContent as Record<string, unknown> | null)
  const [generating, setGenerating] = useState(false)
  const initialError = report.status === 'error'
    ? ((report.generatedContent as { error?: string } | null)?.error ?? '')
    : ''
  const [error, setError] = useState(initialError)
  const [elapsedMs, setElapsedMs] = useState(0)
  const startTimeRef = useRef(0)

  const sections = report.sections as string[]
  const terminalSteps: TerminalStep[] = [
    { id: 'commits', label: 'Fetching commits from GitHub' },
    { id: 'classify', label: 'Classifying commits with AI' },
    ...(sections.includes('executive_summary') ? [{ id: 'executive_summary', label: 'Generating executive summary' }] : []),
    ...(sections.includes('key_highlights') ? [{ id: 'key_highlights', label: 'Generating key highlights' }] : []),
    ...(sections.includes('issues_resolved') ? [{ id: 'issues_resolved', label: 'Generating issues resolved' }] : []),
    ...(sections.includes('weekly_summary') ? [{ id: 'weekly_summary', label: 'Generating weekly summary' }] : []),
    ...(sections.includes('future_plans') ? [{ id: 'future_plans', label: 'Polishing future plans' }] : []),
    { id: 'save', label: 'Saving report' },
  ]

  // Elapsed timer while generating
  useEffect(() => {
    if (status !== 'generating') return
    startTimeRef.current = Date.now()
    const t = setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 200)
    return () => clearInterval(t)
  }, [status])

  // Auto-poll while generating
  useEffect(() => {
    if (status !== 'generating') return
    const interval = setInterval(async () => {
      const res = await fetch(`/api/reports/${report.id}/status`)
      if (!res.ok) return
      const data = await res.json()
      setStatus(data.status)
      if (data.status === 'done') {
        setContent(data.generatedContent)
        clearInterval(interval)
      } else if (data.status === 'error') {
        const msg = (data.generatedContent as { error?: string } | null)?.error
        if (msg) setError(msg)
        clearInterval(interval)
      }
    }, 4000)
    return () => clearInterval(interval)
  }, [status, report.id])

  async function handleGenerate() {
    setGenerating(true)
    setError('')
    // Do NOT set status to 'generating' here — polling would read 'draft' from DB
    // and immediately revert it. Only flip after generate is fired.

    try {
      const repos = report.repos as string[]
      const commitsRes = await fetch('/api/github/commits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repos, startDate: report.startDate, endDate: report.endDate }),
      })
      if (!commitsRes.ok) throw new Error('Failed to fetch commits from GitHub')
      const { commits, error: commitError } = await commitsRes.json()
      if (commitError) throw new Error(commitError)
      if (!commits?.length) throw new Error('No commits found in the selected date range')

      // Race generate against a 3s timeout — catches fast 400/500s, ignores slow OK
      const generateFetch = fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId: report.id, commits }),
      })
      const timeout = new Promise<null>(resolve => setTimeout(() => resolve(null), 3000))
      const result = await Promise.race([generateFetch, timeout])
      if (result && !result.ok) {
        const data = await result.json().catch(() => ({}))
        throw new Error((data as { error?: string }).error ?? 'Generation failed')
      }

      // Safe to start polling — DB status is now 'generating' (or already done)
      setGenerating(false)
      setStatus('generating')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start generation')
      setGenerating(false)
    }
  }

  if (status === 'draft') {
    if (generating) {
      return (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-10 text-center space-y-3">
          <div className="flex justify-center gap-1">
            {[0, 1, 2].map(i => (
              <span key={i} className="w-2 h-2 rounded-full bg-white/40 animate-pulse inline-block"
                style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
          <p className="text-[#888] text-sm">Fetching commits from GitHub…</p>
        </div>
      )
    }
    return (
      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-10 text-center space-y-4">
        <p className="text-[#888] text-sm">This report hasn&apos;t been generated yet.</p>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          onClick={handleGenerate}
          className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
        >
          ✨ Generate Report
        </button>
      </div>
    )
  }

  if (status === 'generating') {
    return (
      <TerminalLoader
        title={report.title}
        steps={terminalSteps}
        currentStep="classify"
        elapsedMs={elapsedMs}
      />
    )
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <div className="bg-red-900/20 border border-red-800 rounded-2xl p-6 text-center space-y-2">
          <p className="text-red-400 font-medium">Generation failed</p>
          {error && (
            <p className="text-red-300/70 text-xs font-mono bg-red-900/30 rounded-lg px-3 py-2 text-left break-all">
              {error}
            </p>
          )}
          <p className="text-[#666] text-xs mt-1">Check your API key in Settings, then retry.</p>
        </div>
        <div className="text-center">
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-60"
          >
            Retry Generation
          </button>
        </div>
      </div>
    )
  }

  if (status === 'done' && content) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <ExportButton reportId={report.id} title={report.title} />
        </div>
        <ReportPreview report={report} profile={profile} content={content} />
      </div>
    )
  }

  return null
}
