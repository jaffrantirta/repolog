import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'
import { reports, developerProfiles } from '@/lib/db/schema'
import { eq, desc, and } from 'drizzle-orm'

export function getReportsCached(userId: string) {
  return unstable_cache(
    async () =>
      db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.createdAt)),
    ['reports', userId],
    { tags: [`reports-${userId}`], revalidate: 60 }
  )()
}

export function getReportCached(id: string, userId: string) {
  return unstable_cache(
    async () => {
      const [row] = await db
        .select()
        .from(reports)
        .where(and(eq(reports.id, id), eq(reports.userId, userId)))
      return row ?? null
    },
    ['report', id, userId],
    { tags: [`report-${id}`, `reports-${userId}`], revalidate: 60 }
  )()
}

export function getProfileCached(userId: string) {
  return unstable_cache(
    async () => {
      const [row] = await db
        .select()
        .from(developerProfiles)
        .where(eq(developerProfiles.userId, userId))
      return row ?? null
    },
    ['profile', userId],
    { tags: [`profile-${userId}`], revalidate: 300 }
  )()
}
