import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-1.5 text-sm text-[#888] mb-6">
            <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
            GitHub Commits → IT Report
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Repolog
          </h1>
          <p className="text-xl text-[#888] max-w-lg mx-auto">
            Turn your GitHub commits into professional IT development reports — in minutes, not hours.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-white text-black rounded-xl font-semibold text-sm hover:bg-[#e5e5e5] transition-colors"
          >
            Sign in with GitHub
          </Link>
          <Link
            href="/demo"
            className="px-6 py-3 bg-[#1a1a1a] border border-[#2a2a2a] text-[#aaa] rounded-xl font-semibold text-sm hover:border-[#444] transition-colors"
          >
            Try Demo
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-8">
          {[
            { icon: '📋', title: 'Select repos & date range', desc: 'Pick any GitHub repos and time period' },
            { icon: '🤖', title: 'AI classifies commits', desc: 'Claude categorizes and translates your work' },
            { icon: '📄', title: 'Export as PDF', desc: 'Professional IT report ready to send' },
          ].map((f, i) => (
            <div key={i} className="bg-[#111] border border-[#1f1f1f] rounded-xl p-4 text-left">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
              <div className="text-xs text-[#666]">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
