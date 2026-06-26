import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { developerProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import SettingsForm from './SettingsForm'

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const [profile] = await db.select().from(developerProfiles).where(eq(developerProfiles.userId, session!.user.id))

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-[#666] text-sm mt-1">Configure your developer profile and API key</p>
      </div>
      <SettingsForm initialProfile={profile ?? null} />
    </div>
  )
}
