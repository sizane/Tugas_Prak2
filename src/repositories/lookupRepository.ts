import { eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { reviews, stalls, users } from '../db/schema.ts';

export async function stallExists(id: number) {
  const db = await getDb();
  return (await db.select({ id: stalls.id }).from(stalls).where(eq(stalls.id, id))).length > 0;
}
export async function userExists(id: number) {
  const db = await getDb();
  return (await db.select({ id: users.id }).from(users).where(eq(users.id, id))).length > 0;
}
export async function reviewExists(id: number) {
  const db = await getDb();
  return (await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.id, id))).length > 0;
}
