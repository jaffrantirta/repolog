'use client'

import { useEffect, useState, useRef } from 'react'

export interface TerminalStep {
  id: string
  label: string
}

type StepState = 'waiting' | 'running' | 'done'

interface Props {
  title: string
  steps: TerminalStep[]
  currentStep: string | null // id of the running step, null = all done
  elapsedMs: number
}

export default function TerminalLoader({ title, steps, currentStep, elapsedMs }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [cursorOn, setCursorOn] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Reveal steps one by one
  useEffect(() => {
    if (visibleCount >= steps.length) return
    const t = setTimeout(() => setVisibleCount(v => v + 1), visibleCount === 0 ? 200 : 600)
    return () => clearTimeout(t)
  }, [visibleCount, steps.length])

  // Blinking cursor
  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), 530)
    return () => clearInterval(t)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [visibleCount])

  function getStepState(id: string, idx: number): StepState {
    if (currentStep === null) return 'done'
    const runningIdx = steps.findIndex(s => s.id === currentStep)
    if (idx < runningIdx) return 'done'
    if (idx === runningIdx) return 'running'
    return 'waiting'
  }

  const elapsed = `${Math.floor(elapsedMs / 1000)}s`

  return (
    <div className="rounded-2xl overflow-hidden border border-[#1f1f1f]" style={{ fontFamily: "'Menlo', 'Monaco', 'Courier New', monospace" }}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#1a1a1a] border-b border-[#2a2a2a]">
        <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <span className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center text-xs text-[#555]">repolog — generate</span>
        <span className="text-xs text-[#444]">{elapsed}</span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0d0d0d] px-5 py-5 min-h-[280px] space-y-1.5">
        {/* Header line */}
        <div className="text-[#4ade80] text-sm mb-3">
          <span className="text-[#555]">$ </span>
          <span>repolog generate</span>
          <span className="text-[#666]"> --report </span>
          <span className="text-[#fbbf24]">&quot;{title}&quot;</span>
        </div>

        {/* Steps */}
        {steps.slice(0, visibleCount).map((step, idx) => {
          const state = getStepState(step.id, idx)
          return (
            <div key={step.id} className="flex items-baseline gap-2 text-sm leading-relaxed">
              <span className="text-[#555] flex-shrink-0">›</span>
              <span className={
                state === 'done' ? 'text-[#888]' :
                state === 'running' ? 'text-white' :
                'text-[#444]'
              }>
                {step.label}
              </span>
              {state === 'running' && (
                <span className="text-[#555] flex-shrink-0">
                  <span className="animate-pulse">...</span>
                  <span className={`inline-block w-[6px] h-[14px] bg-white ml-0.5 align-middle ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
                </span>
              )}
              {state === 'done' && (
                <span className="text-[#4ade80] flex-shrink-0 text-xs">✓</span>
              )}
            </div>
          )
        })}

        {/* All done */}
        {currentStep === null && visibleCount >= steps.length && (
          <div className="pt-3 text-[#4ade80] text-sm font-medium">
            <span className="text-[#555]">$ </span>
            Report generated successfully. Redirecting...
            <span className={`inline-block w-[6px] h-[14px] bg-[#4ade80] ml-1 align-middle ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
