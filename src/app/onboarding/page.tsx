import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import OnboardingForm from './OnboardingForm'

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const [user] = await db
    .select({ onboardingCompleted: users.onboardingCompleted })
    .from(users)
    .where(eq(users.id, session.user.id))

  if (user?.onboardingCompleted) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <p className="text-2xl font-bold tracking-tight">repolog</p>
          <p className="text-[#555] text-sm mt-1">GitHub commits → professional IT reports</p>
        </div>
        <OnboardingForm userEmail={session.user.email ?? ''} userName={session.user.name ?? ''} />
      </div>
    </div>
  )
}
