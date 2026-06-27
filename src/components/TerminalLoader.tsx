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
  currentStep: string | null
  elapsedMs: number
}

export default function TerminalLoader({ title, steps, currentStep, elapsedMs }: Props) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [cursorOn, setCursorOn] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (visibleCount >= steps.length) return
    const t = setTimeout(() => setVisibleCount(v => v + 1), visibleCount === 0 ? 200 : 600)
    return () => clearTimeout(t)
  }, [visibleCount, steps.length])

  useEffect(() => {
    const t = setInterval(() => setCursorOn(v => !v), 530)
    return () => clearInterval(t)
  }, [])

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

  const secs = Math.floor(elapsedMs / 1000)
  const elapsed = secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m${secs % 60}s`

  return (
    <div className="rounded border border-[#1a1a1a] overflow-hidden font-mono">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-[#111] border-b border-[#1a1a1a]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="flex-1 text-center text-xs text-[#333]">repolog — generate</span>
        <span className="text-xs text-[#2a2a2a]">{elapsed}</span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0a0a0a] px-5 py-4 min-h-[240px] space-y-1.5">
        <div className="text-xs text-[#555] mb-3">
          <span className="text-[#333]">$ </span>
          repolog generate
          <span className="text-[#2a2a2a]"> --report </span>
          <span className="text-[#888]">&quot;{title.toLowerCase()}&quot;</span>
        </div>

        {steps.slice(0, visibleCount).map((step, idx) => {
          const state = getStepState(step.id, idx)
          return (
            <div key={step.id} className="flex items-baseline gap-2 text-xs leading-relaxed">
              <span className="text-[#2a2a2a] flex-shrink-0">›</span>
              <span className={
                state === 'done' ? 'text-[#555]' :
                state === 'running' ? 'text-[#aaa]' :
                'text-[#333]'
              }>
                {step.label}
              </span>
              {state === 'running' && (
                <span className="text-[#444] flex-shrink-0">
                  <span className="animate-pulse">...</span>
                  <span className={`inline-block w-[5px] h-[11px] bg-[#aaa] ml-0.5 align-middle ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
                </span>
              )}
              {state === 'done' && (
                <span className="text-green-700 flex-shrink-0">✓</span>
              )}
            </div>
          )
        })}

        {currentStep === null && visibleCount >= steps.length && (
          <div className="pt-3 text-xs text-green-600">
            <span className="text-[#333]">$ </span>
            report generated. redirecting...
            <span className={`inline-block w-[5px] h-[11px] bg-green-600 ml-1 align-middle ${cursorOn ? 'opacity-100' : 'opacity-0'}`} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
