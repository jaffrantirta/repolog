'use client'

import { useState } from 'react'
import type { InferSelectModel } from 'drizzle-orm'
import type { developerProfiles } from '@/lib/db/schema'

type Profile = InferSelectModel<typeof developerProfiles> | null

export default function SettingsForm({ initialProfile }: { initialProfile: Profile }) {
  const [name, setName] = useState(initialProfile?.name ?? '')
  const [email, setEmail] = useState(initialProfile?.email ?? '')
  const [position, setPosition] = useState(initialProfile?.position ?? '')
  const [company, setCompany] = useState(initialProfile?.company ?? '')
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, position, company, apiKey: apiKey || undefined }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputClass = "w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#444]"
  const labelClass = "text-xs text-[#666] mb-1.5 block"

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">Developer Profile</h2>
        <p className="text-xs text-[#666]">This information appears in the report header and footer.</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Position</label>
            <input value={position} onChange={e => setPosition(e.target.value)} placeholder="Full Stack Developer" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="PT. Teknologi Maju" className={inputClass} />
          </div>
        </div>
      </div>

      <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold">AI API Key</h2>
        <p className="text-xs text-[#666]">Enter your TokenRouter or Anthropic API key. Used for report generation. Leave blank to use demo mode key.</p>
        <div>
          <label className={labelClass}>API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={initialProfile ? '••••••••••••••••' : 'sk-ant-...'}
            className={inputClass}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-white text-black rounded-xl text-sm font-semibold hover:bg-[#e5e5e5] transition-colors disabled:opacity-60"
      >
        {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save Settings'}
      </button>
    </div>
  )
}
