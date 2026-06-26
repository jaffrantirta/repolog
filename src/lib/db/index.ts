import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

// Fallback prevents module-level throw during Next.js build when env vars aren't available
const sql = neon(process.env.DATABASE_URL ?? 'postgresql://localhost/placeholder')
export const db = drizzle(sql, { schema })
