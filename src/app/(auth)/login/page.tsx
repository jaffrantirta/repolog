import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import LoginButton from './LoginButton'
import Link from 'next/link'

export default async function LoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session) redirect('/dashboard')

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-6 font-mono">
      <div className="w-full max-w-sm space-y-5">
        <div>
          <p className="text-xs text-[#444] mb-1">
            <span className="text-[#333]">~/</span>repolog
          </p>
          <p className="text-xs text-[#555]">sign in to continue</p>
        </div>

        <div className="border border-[#1a1a1a] rounded p-5 space-y-4">
          <div className="text-xs text-[#333] space-y-1">
            <p><span className="text-[#444]">$</span> repolog auth --provider github</p>
            <p className="text-[#2a2a2a]">authenticating with oauth...</p>
          </div>
          <LoginButton />
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1a1a1a]" />
            <span className="text-xs text-[#333]">or</span>
            <div className="flex-1 h-px bg-[#1a1a1a]" />
          </div>
          <Link
            href="/demo"
            className="flex items-center justify-center gap-2 w-full py-2 rounded text-xs text-[#444] border border-[#1a1a1a] hover:border-[#2a2a2a] hover:text-[#666] transition-colors"
          >
            view demo (no sign-in needed)
          </Link>
        </div>

        <p className="text-xs text-[#333] text-center">
          read-only access to your repositories. no write permissions.
        </p>
      </div>
    </div>
  )
}
