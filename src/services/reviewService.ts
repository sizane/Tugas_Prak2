import * as repo from '../repositories/reviewRepository.ts';
import { stallExists, userExists } from '../repositories/lookupRepository.ts';
import { parseCreateReview } from '../dtos/reviewDto.ts';
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

export async function create(body: any) {
  const dto = parseCreateReview(body);
  if (!(await stallExists(dto.stallId))) throw new AppError('STALL_NOT_FOUND', 404, 'Kedai tidak ditemukan');
  if (!(await userExists(dto.userId))) throw new AppError('USER_NOT_FOUND', 404, 'User tidak ditemukan');
  if (await repo.findByUserAndStall(dto.userId, dto.stallId)) {
    throw new AppError('REVIEW_ALREADY_EXISTS', 409, 'User sudah mereview kedai ini');
  }
  return repo.createAndSync(dto);
}

export async function remove(idParam: unknown) {
  const id = toId(idParam);
  const existing = await repo.findById(id);
  if (!existing) throw notFound();
  await repo.removeAndSync(id, existing.stallId);
  return existing;
}
