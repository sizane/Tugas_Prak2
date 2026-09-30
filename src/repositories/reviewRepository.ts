import { and, count, desc, eq, sql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, stalls, users } from '../db/schema.ts';

const cols = {
  id: reviews.id,
  stallId: reviews.stallId,
  userId: reviews.userId,
  userName: users.name,
  rating: reviews.rating,
  comment: reviews.comment,
  likeCount: reviews.likeCount,
  createdAt: reviews.createdAt,
  updatedAt: reviews.updatedAt,
};

/** avg_rating & review_count kedai dihitung ulang dalam satu statement. */
async function syncStallStats(executor: any, stallId: number) {
  await executor
    .update(stalls)
    .set({
      avgRating: sql`(select cast(coalesce(avg(cast(${reviews.rating} as float)), 0) as decimal(3,2)) from ${reviews} where ${reviews.stallId} = ${stallId})`,
      reviewCount: sql`(select count(*) from ${reviews} where ${reviews.stallId} = ${stallId})`,
    })
    .where(eq(stalls.id, stallId));
}

export async function findAll(p: { stallId?: number; userId?: number; page: number; limit: number; offset: number }) {
  const db = await getDb();
  const cond = [];
  if (p.stallId) cond.push(eq(reviews.stallId, p.stallId));
  if (p.userId) cond.push(eq(reviews.userId, p.userId));
  const where = cond.length ? and(...cond) : undefined;

  const rows = await db
    .select(cols)
    .from(reviews)
    .innerJoin(users, eq(users.id, reviews.userId))
    .where(where)
    .orderBy(desc(reviews.createdAt), desc(reviews.id))
    .offset(p.offset)
    .fetch(p.limit);
  const [{ total }] = await db.select({ total: count() }).from(reviews).where(where);
  return { rows, total };
}

export async function findById(id: number) {
  const db = await getDb();
  const [row] = await db.select(cols).from(reviews).innerJoin(users, eq(users.id, reviews.userId)).where(eq(reviews.id, id));
  return row ?? null;
}

export async function findByUserAndStall(userId: number, stallId: number) {
  const db = await getDb();
  const [row] = await db.select({ id: reviews.id }).from(reviews).where(and(eq(reviews.userId, userId), eq(reviews.stallId, stallId)));
  return row ?? null;
}

export async function createAndSync(data: { stallId: number; userId: number; rating: number; comment: string | null }) {
  const db = await getDb();
  const id = await db.transaction(async (tx) => {
    const [row] = await tx.insert(reviews).output({ id: reviews.id }).values(data);
    await syncStallStats(tx, data.stallId);
    return row.id;
  });
  return findById(id);
}

export async function removeAndSync(id: number, stallId: number) {
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.delete(reviews).where(eq(reviews.id, id));
    await syncStallStats(tx, stallId);
  });
}
