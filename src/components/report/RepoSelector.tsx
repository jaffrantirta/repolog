'use client'

import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

interface Repo { full_name: string; description: string | null; private: boolean; updated_at: string }

interface Props {
  selected: string[]
  onChange: (v: string[]) => void
  aliases: Record<string, string>
  onAliasChange: (a: Record<string, string>) => void
}

export default function RepoSelector({ selected, onChange, aliases, onAliasChange }: Props) {
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
    if (selected.includes(fullName)) {
      onChange(selected.filter(r => r !== fullName))
      const next = { ...aliases }
      delete next[fullName]
      onAliasChange(next)
    } else {
      onChange([...selected, fullName])
    }
  }

  function setAlias(fullName: string, value: string) {
    const next = { ...aliases }
    if (value.trim()) next[fullName] = value
    else delete next[fullName]
    onAliasChange(next)
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
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {filtered.map(repo => {
          const on = selected.includes(repo.full_name)
          return (
            <div
              key={repo.full_name}
              className={`rounded-xl border transition-colors ${
                on ? 'bg-white/10 border-white/20' : 'bg-[#1a1a1a] border-[#2a2a2a] hover:border-[#3a3a3a]'
              }`}
            >
              {/* Row: checkbox + repo info */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggle(repo.full_name)}
                onKeyDown={e => e.key === 'Enter' && toggle(repo.full_name)}
                className="flex items-center gap-3 px-3 py-2.5 cursor-pointer w-full text-left"
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border ${on ? 'bg-white border-white' : 'border-[#444]'}`}>
                  {on && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{repo.full_name}</p>
                  {repo.description && <p className="text-xs text-[#666] truncate">{repo.description}</p>}
                </div>
                {repo.private && <span className="text-xs text-[#555] bg-[#111] border border-[#2a2a2a] rounded px-1.5 py-0.5 flex-shrink-0">private</span>}
              </div>

              {/* Alias input — shown when selected */}
              {on && (
                <div className="px-3 pb-2.5 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <span className="text-xs text-[#555] flex-shrink-0">Alias:</span>
                  <input
                    value={aliases[repo.full_name] ?? ''}
                    onChange={e => setAlias(repo.full_name, e.target.value)}
                    placeholder={repo.full_name.split('/')[1]}
                    className="flex-1 bg-[#0d0d0d] border border-[#2a2a2a] rounded-lg px-2 py-1 text-xs text-white placeholder-[#444] focus:outline-none focus:border-[#555]"
                  />
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <p className="text-[#555] text-sm text-center py-4">No repos found</p>}
      </div>
      {selected.length > 0 && <p className="text-xs text-[#666]">{selected.length} selected</p>}
    </div>
  )
}
