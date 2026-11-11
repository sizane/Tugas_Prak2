import * as repo from '../repositories/flagRepository.ts';
import * as reviewRepo from '../repositories/reviewRepository.ts';
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

/** POST /reviews/:id/flags : customer melaporkan review (reportedBy dari token). */
export async function createForReview(reviewId: number, userId: number, body: { reason?: string | null }) {
  const review = await reviewRepo.findById(reviewId);
  if (!review) throw new AppError('REVIEW_NOT_FOUND', 404, 'Review tidak ditemukan');
  if (review.userId === userId) throw new AppError('FORBIDDEN', 403, 'Tidak dapat melaporkan review milik sendiri');
  if (await repo.findPendingByUser(reviewId, userId)) {
    throw new AppError('FLAG_ALREADY_EXISTS', 409, 'Kamu sudah melaporkan review ini');
  }
  return repo.create(reviewId, userId, body.reason?.trim() || null);
}
