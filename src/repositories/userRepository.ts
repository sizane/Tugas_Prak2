import { and, count, eq, like, or } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { users } from '../db/schema.ts';

/** Kolom publik: passwordHash TIDAK pernah dikembalikan. */
const cols = { id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt };

export async function findAll(p: { search?: string; role?: string; page: number; limit: number; offset: number }) {
  const db = await getDb();
  const cond = [];
  if (p.search) cond.push(or(like(users.name, `%${p.search}%`), like(users.email, `%${p.search}%`)));
  if (p.role) cond.push(eq(users.role, p.role as any));
  const where = cond.length ? and(...cond) : undefined;

  const rows = await db.select(cols).from(users).where(where).orderBy(users.id).offset(p.offset).fetch(p.limit);
  const [{ total }] = await db.select({ total: count() }).from(users).where(where);
  return { rows, total };
}

export async function findByEmail(email: string) {
  const db = await getDb();
  const [row] = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  return row ?? null;
}

export async function create(data: { name: string; email: string; passwordHash: string; role: any }) {
  const db = await getDb();
  const [row] = await db.insert(users).output(cols).values(data);
  return row;
}
