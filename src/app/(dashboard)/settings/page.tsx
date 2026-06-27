import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import SettingsForm from './SettingsForm'
import { getProfileCached } from '@/lib/data'

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const profile = await getProfileCached(session!.user.id)

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <p className="text-xs text-[#444] mb-1">
          <span className="text-[#333]">$</span> repolog config --edit
        </p>
        <p className="text-xs text-[#555]">configure your developer profile and api key</p>
      </div>
      <SettingsForm initialProfile={profile} />
    </div>
  )
}
