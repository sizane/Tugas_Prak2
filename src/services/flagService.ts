import * as repo from '../repositories/flagRepository.ts';
import { FLAG_STATUSES, parseFlagStatus } from '../dtos/flagDto.ts';
import { AppError } from '../utils/errors.ts';
import { bad, paging, toId } from '../utils/validate.ts';

export async function list(q: any) {
  const pg = paging(q);
  const status = q.status ? String(q.status) : undefined;
  if (status && !(FLAG_STATUSES as readonly string[]).includes(status)) {
    throw bad(`status harus salah satu dari: ${FLAG_STATUSES.join(', ')}`);
  }
  const { rows, total } = await repo.findAll({
    status,
    reviewId: q.reviewId ? toId(q.reviewId, 'reviewId') : undefined,
    ...pg,
  });
  return { data: rows, meta: { page: pg.page, limit: pg.limit, total } };
}

export async function updateStatus(idParam: unknown, body: any) {
  const id = toId(idParam);
  if (!(await repo.findById(id))) throw new AppError('FLAG_NOT_FOUND', 404, 'Laporan tidak ditemukan');
  return repo.updateStatus(id, parseFlagStatus(body));
}
