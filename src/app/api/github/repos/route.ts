import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { accounts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const [account] = await db
    .select({ accessToken: accounts.accessToken })
    .from(accounts)
    .where(and(eq(accounts.userId, session.user.id), eq(accounts.providerId, 'github')))

  if (!account?.accessToken) return NextResponse.json({ error: 'no github token' }, { status: 400 })

  const res = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated&type=all', {
    headers: { Authorization: `Bearer ${account.accessToken}`, Accept: 'application/vnd.github+json' },
  })
  const repos = await res.json()
  return NextResponse.json(repos)
}
