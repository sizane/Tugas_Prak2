import { and, eq, sql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { likes, reviews, users } from '../db/schema.ts';

const cols = {
  id: likes.id,
  reviewId: likes.reviewId,
  userId: likes.userId,
  userName: users.name,
  createdAt: likes.createdAt,
};

/** reviews.like_count = jumlah baris LIKES untuk review tsb. */
async function syncLikeCount(executor: any, reviewId: number) {
  await executor
    .update(reviews)
    .set({ likeCount: sql`(select count(*) from ${likes} where ${likes.reviewId} = ${reviewId})` })
    .where(eq(reviews.id, reviewId));
}

export async function find(reviewId: number, userId: number) {
  const db = await getDb();
  const [row] = await db
    .select(cols)
    .from(likes)
    .innerJoin(users, eq(users.id, likes.userId))
    .where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
  return row ?? null;
}

export async function createAndSync(reviewId: number, userId: number) {
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.insert(likes).values({ reviewId, userId });
    await syncLikeCount(tx, reviewId);
  });
  return find(reviewId, userId);
}

export async function removeAndSync(reviewId: number, userId: number) {
  const db = await getDb();
  await db.transaction(async (tx) => {
    await tx.delete(likes).where(and(eq(likes.reviewId, reviewId), eq(likes.userId, userId)));
    await syncLikeCount(tx, reviewId);
  });
}
