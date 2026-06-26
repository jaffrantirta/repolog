'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth-client'
import Image from 'next/image'
import { FileText, Settings, LayoutDashboard, LogOut } from 'lucide-react'

type User = { name: string; email: string; image?: string | null }

export default function NavBar({ user }: { user: User }) {
  const path = usePathname()
  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/reports/new', icon: FileText, label: 'New Report' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="border-b border-[#1f1f1f] bg-[#0a0a0a]/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="font-bold text-white text-lg">repolog</Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  path === href || (path.startsWith(href + '/') && href !== '/dashboard')
                    ? 'bg-[#1a1a1a] text-white'
                    : 'text-[#666] hover:text-white'
                }`}
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user.image && (
            <Image src={user.image} alt={user.name} width={28} height={28} className="rounded-full" />
          )}
          <button
            onClick={() => signOut({ fetchOptions: { onSuccess: () => { window.location.href = '/login' } } })}
            className="text-[#666] hover:text-white transition-colors"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  )
}
