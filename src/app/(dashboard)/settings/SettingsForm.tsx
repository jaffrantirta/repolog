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

  const inputClass =
    'w-full bg-[#0d0d0d] border border-[#1a1a1a] rounded px-3 py-2 text-xs text-[#aaa] placeholder-[#333] focus:outline-none focus:border-[#2a2a2a] font-mono'
  const labelClass = 'text-xs text-[#444] mb-1.5 block'

  return (
    <div className="space-y-6">
      {/* Developer profile */}
      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        <div>
          <p className="text-xs text-[#444] mb-0.5"># developer profile</p>
          <p className="text-xs text-[#333]">appears in the report header and footer.</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>full name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="john doe" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="john@company.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>position</label>
            <input value={position} onChange={e => setPosition(e.target.value)} placeholder="full stack developer" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>company</label>
            <input value={company} onChange={e => setCompany(e.target.value)} placeholder="pt. teknologi maju" className={inputClass} />
          </div>
        </div>
      </div>

      {/* API key */}
      <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
        <div>
          <p className="text-xs text-[#444] mb-0.5"># ai api key</p>
          <p className="text-xs text-[#333]">
            enter your anthropic or tokenrouter api key. leave blank to use the shared key.
          </p>
        </div>
        <div>
          <label className={labelClass}>api key</label>
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder={initialProfile ? '••••••••••••••••  (key already saved)' : 'sk-ant-...'}
            className={inputClass}
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className={`px-4 py-2 rounded text-xs font-bold transition-colors disabled:opacity-50 ${
          saved
            ? 'bg-green-950 border border-green-900 text-green-400'
            : 'bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] hover:border-[#444] hover:text-white'
        }`}
      >
        {saved ? '✓ saved' : saving ? 'saving...' : '$ save settings'}
      </button>
    </div>
  )
}
