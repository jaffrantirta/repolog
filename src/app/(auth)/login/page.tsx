import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import LoginButton from './LoginButton'

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Sign in to Repolog</h1>
          <p className="text-sm text-[#666] mt-2">Connect your GitHub to get started</p>
        </div>
        <div className="bg-[#111] border border-[#1f1f1f] rounded-2xl p-6 space-y-4">
          <LoginButton />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1f1f1f]" />
            <span className="text-xs text-[#444]">or</span>
            <div className="flex-1 h-px bg-[#1f1f1f]" />
          </div>
          <a
            href="/demo"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium bg-transparent border border-[#2a2a2a] text-[#666] hover:border-[#444] transition-colors"
          >
            Try Demo (no sign-in needed)
          </a>
        </div>
        <p className="text-center text-xs text-[#444]">
          We only request read access to your repositories.
        </p>
      </div>
    </div>
  )
}
