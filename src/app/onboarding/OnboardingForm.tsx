'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronRight, User, KeyRound, Sparkles } from 'lucide-react'

type Step = 'welcome' | 'profile' | 'apikey'

const STEPS: Step[] = ['welcome', 'profile', 'apikey']

export default function OnboardingForm({ userEmail, userName }: { userEmail: string; userName: string }) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('welcome')
  const [name, setName] = useState(userName)
  const [email, setEmail] = useState(userEmail)
  const [position, setPosition] = useState('')
  const [company, setCompany] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const stepIdx = STEPS.indexOf(step)

  async function handleFinish() {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, position, company, apiKey: apiKey || undefined }),
      })
      if (!res.ok) throw new Error('Failed to save')
      router.push('/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
      setSaving(false)
    }
  }

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#555] transition-colors"
  const labelClass = "text-xs text-[#666] mb-1.5 block"

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl overflow-hidden">
      {/* Progress bar */}
      <div className="flex border-b border-[#1f1f1f]">
        {[
          { id: 'welcome', icon: <Sparkles size={13} />, label: 'Welcome' },
          { id: 'profile', icon: <User size={13} />, label: 'Profile' },
          { id: 'apikey', icon: <KeyRound size={13} />, label: 'API Key' },
        ].map((s, i) => {
          const done = i < stepIdx
          const active = s.id === step
          return (
            <div key={s.id} className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors ${
              active ? 'text-white border-b-2 border-white' :
              done ? 'text-[#4ade80]' :
              'text-[#444]'
            }`}>
              {done ? <Check size={13} /> : s.icon}
              {s.label}
            </div>
          )
        })}
      </div>

      <div className="p-7">
        {/* Step: Welcome */}
        {step === 'welcome' && (
          <div className="space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-2xl">
              👋
            </div>
            <div>
              <h1 className="text-xl font-bold">Welcome to Repolog{name ? `, ${name.split(' ')[0]}` : ''}!</h1>
              <p className="text-[#666] text-sm mt-2 leading-relaxed">
                Let&apos;s get you set up in 2 minutes. We&apos;ll save a few details that appear in your generated reports.
              </p>
            </div>
            <div className="text-left space-y-3">
              {[
                { icon: '📋', text: 'Your name & company appear in the report header' },
                { icon: '🤖', text: 'AI classifies your commits into professional sections' },
                { icon: '📄', text: 'Export polished PDF reports in seconds' },
              ].map(item => (
                <div key={item.text} className="flex items-start gap-3 text-sm text-[#888]">
                  <span className="mt-0.5">{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep('profile')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors"
            >
              Get Started <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step: Profile */}
        {step === 'profile' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold">Developer Profile</h2>
              <p className="text-[#666] text-xs mt-1">Appears in the header and footer of every report you generate.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Position <span className="text-red-500">*</span></label>
                <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Full Stack Developer" className={inputClass} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className={labelClass}>Company <span className="text-red-500">*</span></label>
                <input value={company} onChange={e => setCompany(e.target.value)} placeholder="PT. Teknologi Maju" className={inputClass} />
              </div>
            </div>
            <div className="flex justify-between pt-1">
              <button onClick={() => setStep('welcome')} className="text-sm text-[#555] hover:text-white transition-colors">
                Back
              </button>
              <button
                onClick={() => setStep('apikey')}
                disabled={!name.trim() || !position.trim() || !company.trim()}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step: API Key */}
        {step === 'apikey' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold">AI API Key</h2>
              <p className="text-[#666] text-xs mt-1">Used to generate your reports. You can skip this and use our shared key.</p>
            </div>
            <div>
              <label className={labelClass}>API Key <span className="text-[#555]">(optional)</span></label>
              <input
                type="password"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                className={inputClass}
              />
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-xs text-[#666] space-y-1">
              <p className="text-[#888] font-medium">Where to get one?</p>
              <p>Get a key from your AI provider (Anthropic, TokenRouter, or OpenAI-compatible endpoint) and paste it here.</p>
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <div className="flex justify-between pt-1">
              <button onClick={() => setStep('profile')} className="text-sm text-[#555] hover:text-white transition-colors">
                Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="text-sm text-[#555] hover:text-white transition-colors disabled:opacity-40"
                >
                  {saving ? 'Saving…' : 'Skip for now'}
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving…' : <><Check size={15} /> Finish Setup</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
