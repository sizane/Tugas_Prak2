import * as repo from '../repositories/auditLogRepository.ts';
import { userExists } from '../repositories/lookupRepository.ts';
import { parseCreateAuditLog } from '../dtos/auditLogDto.ts';
import { AppError } from '../utils/errors.ts';
import { paging, toId } from '../utils/validate.ts';

const parseMeta = (s: string | null) => {
  if (!s) return null;
  try { return JSON.parse(s); } catch { return s; }
};
const shape = <T extends { metadata: string | null }>(r: T) => ({ ...r, metadata: parseMeta(r.metadata) });

export async function list(q: any) {
  const pg = paging(q);
  const { rows, total } = await repo.findAll({
    userId: q.userId ? toId(q.userId, 'userId') : undefined,
    action: q.action ? String(q.action).toUpperCase() : undefined,
    targetTable: q.targetTable ? String(q.targetTable).toUpperCase() : undefined,
    ...pg,
  });
  return { data: rows.map(shape), meta: { page: pg.page, limit: pg.limit, total } };
}

export async function create(body: any) {
  const dto = parseCreateAuditLog(body);
  if (!(await userExists(dto.userId))) throw new AppError('USER_NOT_FOUND', 404, 'User tidak ditemukan');
  return shape((await repo.create(dto))!);
}
