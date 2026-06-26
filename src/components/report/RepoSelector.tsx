'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface Repo { full_name: string; description: string | null; private: boolean; updated_at: string }

export default function RepoSelector({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/github/repos').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRepos(data)
      setLoading(false)
    })
  }, [])

  function toggle(fullName: string) {
    onChange(selected.includes(fullName) ? selected.filter(r => r !== fullName) : [...selected, fullName])
  }

  const filtered = repos.filter(r => r.full_name.toLowerCase().includes(search.toLowerCase()))

  if (loading) return <div className="text-[#666] text-sm text-center py-8">Loading repositories…</div>

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search repos…"
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder-[#444]"
        />
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {filtered.map(repo => {
          const on = selected.includes(repo.full_name)
          return (
            <button
              key={repo.full_name}
              onClick={() => toggle(repo.full_name)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                on ? 'bg-white/10 border border-white/20' : 'bg-[#1a1a1a] border border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${on ? 'bg-white border-white' : 'border-[#444]'}`}>
                {on && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{repo.full_name}</p>
                {repo.description && <p className="text-xs text-[#666] truncate">{repo.description}</p>}
              </div>
              {repo.private && <span className="text-xs text-[#555] bg-[#111] border border-[#2a2a2a] rounded px-1.5 py-0.5 ml-auto flex-shrink-0">private</span>}
            </button>
          )
        })}
        {filtered.length === 0 && <p className="text-[#555] text-sm text-center py-4">No repos found</p>}
      </div>
      {selected.length > 0 && <p className="text-xs text-[#666]">{selected.length} selected</p>}
    </div>
  )
}
