import { and, count, desc, eq, gte, lt, sql as rawSql } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs, users } from '../db/schema.ts';

const cols = {
  id: auditLogs.id,
  userId: auditLogs.userId,
  userName: users.name,
  userEmail: users.email,
  action: auditLogs.action,
  targetTable: auditLogs.targetTable,
  targetId: auditLogs.targetId,
  metadata: auditLogs.metadata,
  createdAt: auditLogs.createdAt,
};

export interface AuditEntry {
  userId: number;
  action: string;
  targetTable: string;
  targetId: number;
  metadata?: unknown;
}

function startOfDay(value: string): Date {
  return new Date(`${value}T00:00:00`);
}

function endOfDayExclusive(value: string): Date {
  const date = startOfDay(value);
  date.setDate(date.getDate() + 1);
  return date;
}

export async function findAll(p: {
  userId?: number;
  action?: string;
  targetTable?: string;
  targetId?: number;
  from?: string;
  to?: string;
  page: number;
  pageSize: number;
  offset: number;
}) {
  const db = await getDb();
  const cond = [];
  if (p.userId) cond.push(eq(auditLogs.userId, p.userId));
  if (p.action) cond.push(eq(auditLogs.action, p.action));
  if (p.targetTable) cond.push(eq(auditLogs.targetTable, p.targetTable));
  if (p.targetId) cond.push(eq(auditLogs.targetId, p.targetId));
  if (p.from) cond.push(gte(auditLogs.createdAt, startOfDay(p.from)));
  if (p.to) cond.push(lt(auditLogs.createdAt, endOfDayExclusive(p.to)));
  const where = cond.length ? and(...cond) : undefined;

  const rows = await db
    .select(cols)
    .from(auditLogs)
    .leftJoin(users, eq(users.id, auditLogs.userId))
    .where(where)
    .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
    .offset(p.offset)
    .fetch(p.pageSize);
  const [{ total }] = await db.select({ total: count() }).from(auditLogs).where(where);
  return { rows, total };
}

export async function findById(id: number) {
  const db = await getDb();
  const [row] = await db
    .select(cols)
    .from(auditLogs)
    .leftJoin(users, eq(users.id, auditLogs.userId))
    .where(eq(auditLogs.id, id));
  return row ?? null;
}

export async function insertAudit(entry: AuditEntry) {
  const db = await getDb();
  const metadata = entry.metadata === undefined ? null : JSON.stringify(entry.metadata);
  await db.insert(auditLogs).values({
    userId: entry.userId,
    action: entry.action,
    targetTable: entry.targetTable,
    targetId: entry.targetId,
    metadata,
  });
}
