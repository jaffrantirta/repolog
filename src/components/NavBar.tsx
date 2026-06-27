'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import Image from 'next/image'
import { LogOut } from 'lucide-react'

type User = { name: string; email: string; image?: string | null }

export default function NavBar({ user }: { user: User }) {
  const path = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'dashboard' },
    { href: '/reports/new', label: '+ new report' },
    { href: '/settings', label: 'settings' },
  ]

  return (
    <nav className="border-b border-[#1a1a1a] bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-10 font-mono">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/dashboard" className="text-sm text-[#555]">
            <span className="text-[#333]">~/</span>repolog
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ href, label }) => {
              const active = path === href || (path.startsWith(href + '/') && href !== '/dashboard')
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    active ? 'text-white bg-[#1a1a1a]' : 'text-[#444] hover:text-[#888]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.image && (
            <Image src={user.image} alt={user.name} width={22} height={22} className="rounded-full opacity-70" />
          )}
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/login' } } })}
            className="text-[#333] hover:text-[#666] transition-colors"
            title="sign out"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </nav>
  )
}
