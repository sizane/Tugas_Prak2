import { and, count, eq, like } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { menuItems, stalls } from '../db/schema.ts';

export class MenuItemRepository {
  async findByStallId(stallId: number) {
    const db = await getDb();
    return db.select().from(menuItems).where(eq(menuItems.stallId, stallId));
  }
}

const cols = {
  id: menuItems.id,
  stallId: menuItems.stallId,
  name: menuItems.name,
  price: menuItems.price,
  isAvailable: menuItems.isAvailable,
  stallName: stalls.name,
  stallLocation: stalls.location,
};

export async function findAll(p: { stallId?: number; search?: string; available?: boolean; page: number; limit: number; offset: number }) {
  const db = await getDb();
  const cond = [];
  if (p.stallId) cond.push(eq(menuItems.stallId, p.stallId));
  if (p.search) cond.push(like(menuItems.name, `%${p.search}%`));
  if (p.available !== undefined) cond.push(eq(menuItems.isAvailable, p.available));
  const where = cond.length ? and(...cond) : undefined;

  const rows = await db
    .select(cols)
    .from(menuItems)
    .innerJoin(stalls, eq(stalls.id, menuItems.stallId))
    .where(where)
    .orderBy(menuItems.id)
    .offset(p.offset)
    .fetch(p.limit);
  const [{ total }] = await db.select({ total: count() }).from(menuItems).where(where);
  return { rows, total };
}

export async function findById(id: number) {
  const db = await getDb();
  const [row] = await db
    .select(cols)
    .from(menuItems)
    .innerJoin(stalls, eq(stalls.id, menuItems.stallId))
    .where(eq(menuItems.id, id));
  return row ?? null;
}

export async function create(data: { stallId: number; name: string; price: number; isAvailable: boolean }) {
  const db = await getDb();
  const [row] = await db.insert(menuItems).output({ id: menuItems.id }).values(data);
  return findById(row.id);
}

export async function update(id: number, data: Record<string, unknown>) {
  const db = await getDb();
  await db.update(menuItems).set(data).where(eq(menuItems.id, id));
  return findById(id);
}

export async function remove(id: number) {
  const db = await getDb();
  await db.delete(menuItems).where(eq(menuItems.id, id));
}
