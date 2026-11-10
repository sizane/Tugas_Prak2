import * as repo from '../repositories/reviewRepository.ts';
import { stallExists } from '../repositories/lookupRepository.ts';
import { AppError } from '../utils/errors.ts';
import { paging, toId } from '../utils/validate.ts';

const notFound = () => new AppError('REVIEW_NOT_FOUND', 404, 'Review tidak ditemukan');

export async function list(q: any, stallIdFromPath?: unknown) {
  const pg = paging(q);
  const stallId = stallIdFromPath ? toId(stallIdFromPath, 'stallId') : q.stallId ? toId(q.stallId, 'stallId') : undefined;
  const userId = q.userId ? toId(q.userId, 'userId') : undefined;
  const { rows, total } = await repo.findAll({ stallId, userId, ...pg });
  return { data: rows, meta: { page: pg.page, limit: pg.limit, total } };
}

export async function remove(idParam: unknown) {
  const id = toId(idParam);
  const existing = await repo.findById(id);
  if (!existing) throw notFound();
  await repo.removeAndSync(id, existing.stallId);
  return existing;
}

export async function createForStall(stallId: number, userId: number, body: { rating: number; comment?: string }) {
  if (!(await stallExists(stallId))) throw new AppError('STALL_NOT_FOUND', 404, 'Warung tidak ditemukan');
  if (await repo.findByUserAndStall(userId, stallId)) {
    throw new AppError('REVIEW_ALREADY_EXISTS', 409, 'User sudah mereview warung ini');
  }
  return repo.createAndSync({ stallId, userId, rating: body.rating, comment: body.comment ?? null });
}