import { and, count, desc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { flags, reviews, users } from '../db/schema.ts';
 
const cols = {
  id: flags.id,
  reviewId: flags.reviewId,
  reviewComment: reviews.comment,
  reviewRating: reviews.rating,
  reportedBy: flags.reportedBy,
  reporterName: users.name,
  reason: flags.reason,
  status: flags.status,
  createdAt: flags.createdAt,
};

const baseQuery = (db: Awaited<ReturnType<typeof getDb>>) =>
  db
    .select(cols)
    .from(flags)
    .innerJoin(reviews, eq(reviews.id, flags.reviewId))
    .innerJoin(users, eq(users.id, flags.reportedBy));
 
export async function findAll(p: { status?: string; reviewId?: number; page: number; limit: number; offset: number }) {
  const db = await getDb();
  const cond = [];
  if (p.status) cond.push(eq(flags.status, p.status as any));
  if (p.reviewId) cond.push(eq(flags.reviewId, p.reviewId));
  const where = cond.length ? and(...cond) : undefined;
 
  const rows = await baseQuery(db)
    .where(where)
    .orderBy(desc(flags.createdAt), desc(flags.id))
    .offset(p.offset)
    .fetch(p.limit);
  const [{ total }] = await db.select({ total: count() }).from(flags).where(where);
  return { rows, total };
}
 
export async function findById(id: number) {
  const db = await getDb();
  const [row] = await baseQuery(db).where(eq(flags.id, id));
  return row ?? null;
}
 
export async function updateStatus(id: number, status: string) {
  const db = await getDb();
  await db.update(flags).set({ status: status as any }).where(eq(flags.id, id));
  return findById(id);
}
