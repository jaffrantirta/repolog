'use client'

import { useState } from 'react'
import ReportPreview from '@/components/report/ReportPreview'
import { DEMO_COMMITS, DEMO_REPORT_CONFIG } from '@/lib/demo-commits'
import Link from 'next/link'

export default function DemoPage() {
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')

  async function generate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/demo/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commits: DEMO_COMMITS, sections: DEMO_REPORT_CONFIG.sections }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setContent(data.content)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    }
    setLoading(false)
  }

  const demoReport = {
    id: 'demo',
    userId: 'demo',
    title: DEMO_REPORT_CONFIG.title,
    startDate: DEMO_REPORT_CONFIG.startDate,
    endDate: DEMO_REPORT_CONFIG.endDate,
    repos: DEMO_REPORT_CONFIG.repos,
    sections: DEMO_REPORT_CONFIG.sections,
    language: 'id',
    status: 'done' as const,
    generatedContent: content,
    futurePlansInput: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-[#666] text-sm hover:text-white transition-colors">← Back</Link>
            <h1 className="text-2xl font-bold mt-2">Demo — Repolog</h1>
            <p className="text-[#666] text-sm">See how Repolog transforms 30 GitHub commits into a professional IT report.</p>
          </div>
        </div>

        {!content && (
          <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-8 text-center space-y-4">
            <p className="text-[#888] text-sm">30 sample commits from 3 repos (web-app, api-service, admin-panel) · June 2025</p>
            <button
              onClick={generate}
              disabled={loading}
              className="px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-[#e5e5e5] transition-colors disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="flex gap-1">{[0,1,2].map(i => <span key={i} className="w-1.5 h-1.5 rounded-full bg-black animate-pulse inline-block" style={{ animationDelay: `${i * 150}ms` }} />)}</span>
                  Generating report… (~30s)
                </span>
              ) : '✨ Generate Demo Report'}
            </button>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        )}

        {content && (
          <>
            <div className="flex justify-between items-center">
              <p className="text-[#666] text-sm">Report generated successfully</p>
              <Link href="/login" className="px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors">
                Sign in to use with your repos →
              </Link>
            </div>
            <ReportPreview report={demoReport} profile={null} content={content} />
          </>
        )}
      </div>
    </div>
  )
}
