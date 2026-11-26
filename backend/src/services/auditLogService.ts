import * as repo from '../repositories/auditLogRepository.ts';
import type { AuditEntry } from '../repositories/auditLogRepository.ts';
import type { AuditLogQuery } from '../schemas/auditLogSchema.ts';
import { AppError } from '../utils/errors.ts';

const parseMeta = (s: string | null) => {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return s; }
};

function toIso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

const shape = <T extends { metadata: string | null; createdAt: Date | string | null }>(r: T) => ({
  ...r,
  metadata: parseMeta(r.metadata),
  createdAt: toIso(r.createdAt),
});

export async function list(query: AuditLogQuery) {
  const offset = (query.page - 1) * query.pageSize;
  const { rows, total } = await repo.findAll({
    userId: query.userId,
    action: query.action,
    targetTable: query.targetTable,
    targetId: query.targetId,
    from: query.from,
    to: query.to,
    page: query.page,
    pageSize: query.pageSize,
    offset,
  });
  const totalPages = total === 0 ? 0 : Math.ceil(total / query.pageSize);
  return {
    items: rows.map(shape),
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      total,
      totalPages,
    },
  };
}

export async function getById(id: number) {
  const row = await repo.findById(id);
  if (!row) throw new AppError('NOT_FOUND', 404, 'Catatan audit tidak ditemukan');
  return shape(row);
}

/** Dipanggil di dalam transaksi mutasi bisnis supaya audit ikut atomik. */
export async function record(entry: AuditEntry): Promise<void> {
  await repo.insertAudit(entry);
}

/**
 * Login/Logout bersifat best-effort: kegagalan audit tidak boleh menggagalkan
 * autentikasi. Kegagalan hanya di-log ke console.
 */
export async function recordBestEffort(entry: AuditEntry): Promise<void> {
  try {
    await repo.insertAudit(entry);
  } catch (error) {
    console.error(`Audit ${entry.action} gagal dicatat:`, error);
  }
}
