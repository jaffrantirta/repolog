import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { developerProfiles, users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { name, email, position, company, apiKey } = await req.json()

  const [existing] = await db
    .select({ id: developerProfiles.id })
    .from(developerProfiles)
    .where(eq(developerProfiles.userId, session.user.id))

  if (existing) {
    await db.update(developerProfiles)
      .set({ name, email, position, company, updatedAt: new Date() })
      .where(eq(developerProfiles.userId, session.user.id))
  } else {
    await db.insert(developerProfiles).values({ userId: session.user.id, name, email, position, company })
  }

  await db.update(users)
    .set({
      onboardingCompleted: true,
      ...(apiKey ? { anthropicApiKey: apiKey } : {}),
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))

  return NextResponse.json({ ok: true })
}
