import { and, count, eq, like, type SQL } from 'drizzle-orm';
import { getDb } from '../db/index.ts';
import { auditLogs, stalls } from '../db/schema.ts';

export interface FindAllParams {
  search?: string;
  category?: string;
  page: number;
  limit: number;
}

export interface CreateStallInput {
  ownerId: number;
  name: string;
  category?: string | null;
  location?: string | null;
  description?: string | null;
}

export class StallRepository {
  async findAll(params: FindAllParams) {
    const db = await getDb();

    const conditions: SQL[] = [];
    if (params.search) conditions.push(like(stalls.name, `%${params.search}%`));
    if (params.category) conditions.push(eq(stalls.category, params.category));
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const offset = (params.page - 1) * params.limit;

    const rows = await db
      .select()
      .from(stalls)
      .where(where)
      .orderBy(stalls.id)
      .offset(offset)
      .fetch(params.limit);

    const totals = await db.select({ total: count() }).from(stalls).where(where);

    return { rows, total: Number(totals[0]?.total ?? 0) };
  }

  async findById(id: number) {
    const db = await getDb();
    const rows = await db.select().from(stalls).where(eq(stalls.id, id));
    return rows[0];
  }

  async create(input: CreateStallInput, actorId: number) {
    const db = await getDb();
    const row = await db.transaction(async (tx) => {
      const [newStall] = await tx
        .insert(stalls)
        .output()
        .values({
          ownerId: input.ownerId,
          name: input.name,
          category: input.category ?? null,
          location: input.location ?? null,
          description: input.description ?? null,
          avgRating: '0.00',
          reviewCount: 0,
        });

      await tx.insert(auditLogs).values({
        userId: actorId,
        action: 'CREATE_STALL',
        targetTable: 'STALLS',
        targetId: newStall.id,
        metadata: JSON.stringify({
          name: input.name,
          category: input.category,
          location: input.location,
        }),
      });

      return newStall;
    });
    return row;
  }

  async update(id: number, input: Partial<CreateStallInput>, actorId: number) {
    const db = await getDb();
    const row = await db.transaction(async (tx) => {
      const [updatedStall] = await tx
        .update(stalls)
        .set({
          ...(input.ownerId !== undefined ? { ownerId: input.ownerId } : {}),
          ...(input.name !== undefined ? { name: input.name } : {}),
          ...(input.category !== undefined ? { category: input.category } : {}),
          ...(input.location !== undefined ? { location: input.location } : {}),
          ...(input.description !== undefined ? { description: input.description } : {}),
        })
        .where(eq(stalls.id, id))
        .output();

      await tx.insert(auditLogs).values({
        userId: actorId,
        action: 'UPDATE_STALL',
        targetTable: 'STALLS',
        targetId: id,
        metadata: JSON.stringify(input),
      });

      return updatedStall;
    });
    return row;
  }

  async remove(id: number, actorId: number, name: string) {
    const db = await getDb();
    const row = await db.transaction(async (tx) => {
      const [deletedStall] = await tx.delete(stalls).where(eq(stalls.id, id)).output();

      await tx.insert(auditLogs).values({
        userId: actorId,
        action: 'DELETE_STALL',
        targetTable: 'STALLS',
        targetId: id,
        metadata: JSON.stringify({ name }),
      });

      return deletedStall;
    });
    return row;
  }
}
