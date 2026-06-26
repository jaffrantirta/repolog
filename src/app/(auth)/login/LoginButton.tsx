'use client'

import { signIn } from '@/lib/auth-client'
import { useState } from 'react'
import { Github } from 'lucide-react'

export default function LoginButton() {
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    setLoading(true)
    await signIn.social({ provider: 'github', callbackURL: '/dashboard' })
  }

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-[#e5e5e5] transition-colors disabled:opacity-60"
    >
      <Github size={16} />
      {loading ? 'Connecting…' : 'Continue with GitHub'}
    </button>
  )
}
