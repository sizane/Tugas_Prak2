import { and, count, desc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs, users } from '../db/schema.ts';

const cols = {
  id: auditLogs.id,
  userId: auditLogs.userId,
  userName: users.name,
  action: auditLogs.action,
  targetTable: auditLogs.targetTable,
  targetId: auditLogs.targetId,
  metadata: auditLogs.metadata,
  createdAt: auditLogs.createdAt,
};

export async function findAll(p: { userId?: number; action?: string; targetTable?: string; page: number; limit: number; offset: number }) {
  const db = await getDb();
  const cond = [];
  if (p.userId) cond.push(eq(auditLogs.userId, p.userId));
  if (p.action) cond.push(eq(auditLogs.action, p.action));
  if (p.targetTable) cond.push(eq(auditLogs.targetTable, p.targetTable));
  const where = cond.length ? and(...cond) : undefined;

  const rows = await db
    .select(cols)
    .from(auditLogs)
    .innerJoin(users, eq(users.id, auditLogs.userId))
    .where(where)
    .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
    .offset(p.offset)
    .fetch(p.limit);
  const [{ total }] = await db.select({ total: count() }).from(auditLogs).where(where);
  return { rows, total };
}

export async function findById(id: number) {
  const db = await getDb();
  const [row] = await db.select(cols).from(auditLogs).innerJoin(users, eq(users.id, auditLogs.userId)).where(eq(auditLogs.id, id));
  return row ?? null;
}

export async function create(data: { userId: number; action: string; targetTable: string; targetId: number; metadata: string | null }) {
  const db = await getDb();
  const [row] = await db.insert(auditLogs).output({ id: auditLogs.id }).values(data);
  return findById(row.id);
}
