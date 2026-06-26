import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { accounts } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { repos, startDate, endDate } = await req.json()

  const [account] = await db
    .select({ accessToken: accounts.accessToken })
    .from(accounts)
    .where(and(eq(accounts.userId, session.user.id), eq(accounts.providerId, 'github')))

  if (!account?.accessToken) return NextResponse.json({ error: 'no github token' }, { status: 400 })

  const allCommits: object[] = []

  for (const repoFullName of repos as string[]) {
    let page = 1
    while (true) {
      const url = `https://api.github.com/repos/${repoFullName}/commits?since=${startDate}T00:00:00Z&until=${endDate}T23:59:59Z&per_page=100&page=${page}`
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${account.accessToken}`, Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) break
      const commits = await res.json()
      if (!Array.isArray(commits) || commits.length === 0) break
      for (const c of commits) {
        allCommits.push({
          hash: c.sha?.slice(0, 7),
          message: c.commit?.message?.split('\n')[0],
          date: c.commit?.author?.date?.split('T')[0],
          repo: repoFullName.split('/')[1],
          author: c.commit?.author?.name,
        })
      }
      if (commits.length < 100) break
      page++
    }
  }

  return NextResponse.json({ commits: allCommits })
}
