import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import NavBar from '@/components/NavBar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <NavBar user={session.user} />
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
