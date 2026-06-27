'use client'

import { useEffect, useState } from 'react'

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

  if (loading) return (
    <div className="text-xs text-[#444] py-4 font-mono">
      <span className="animate-pulse">› fetching repositories...</span>
    </div>
  )

  return (
    <div className="space-y-3 font-mono">
      {/* Search */}
      <div className="flex items-center bg-[#0d0d0d] border border-[#1a1a1a] rounded px-3 py-2 gap-2 focus-within:border-[#2a2a2a]">
        <span className="text-xs text-[#333] flex-shrink-0">&gt;</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="filter repositories..."
          className="flex-1 bg-transparent text-xs text-[#aaa] placeholder-[#333] focus:outline-none"
        />
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-[#333] hover:text-[#555]">×</button>
        )}
      </div>

      {/* Repo list */}
      <div className="space-y-0 max-h-72 overflow-y-auto divide-y divide-[#0f0f0f]">
        {filtered.map(repo => {
          const on = selected.includes(repo.full_name)
          return (
            <div key={repo.full_name} className={`transition-colors ${on ? 'bg-[#0f0f0f]' : ''}`}>
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggle(repo.full_name)}
                onKeyDown={e => e.key === 'Enter' && toggle(repo.full_name)}
                className="flex items-center gap-2.5 px-2 py-2 cursor-pointer w-full text-left hover:bg-[#0f0f0f] transition-colors"
              >
                <span className={`text-xs flex-shrink-0 w-6 text-center ${on ? 'text-green-500' : 'text-[#2a2a2a]'}`}>
                  {on ? '[x]' : '[ ]'}
                </span>
                <span className={`text-xs ${on ? 'text-[#ccc]' : 'text-[#555]'} truncate flex-1`}>
                  {on && <span className="text-green-700 mr-1">→</span>}
                  {repo.full_name}
                </span>
                {repo.private && <span className="text-xs text-[#333] flex-shrink-0">pvt</span>}
              </div>
              {on && (
                <div className="px-2 pb-2 flex items-center gap-2 ml-8" onClick={e => e.stopPropagation()}>
                  <span className="text-xs text-[#333] flex-shrink-0">alias:</span>
                  <input
                    value={aliases[repo.full_name] ?? ''}
                    onChange={e => setAlias(repo.full_name, e.target.value)}
                    placeholder={repo.full_name.split('/')[1]}
                    className="flex-1 bg-transparent border-b border-[#1a1a1a] px-1 py-0.5 text-xs text-[#888] placeholder-[#333] focus:outline-none focus:border-[#333]"
                  />
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-xs text-[#333] py-4">&gt; no repositories found</p>
        )}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-[#444]">→ {selected.length} {selected.length === 1 ? 'repo' : 'repos'} selected</p>
      )}
    </div>
  )
}
