import * as repo from '../repositories/likeRepository.ts';
import { reviewExists, userExists } from '../repositories/lookupRepository.ts';
import { parseLike } from '../dtos/likeDto.ts';
import { AppError } from '../utils/errors.ts';
import { toId } from '../utils/validate.ts';

export async function create(body: any) {
  const { reviewId, userId } = parseLike(body);
  if (!(await reviewExists(reviewId))) throw new AppError('REVIEW_NOT_FOUND', 404, 'Review tidak ditemukan');
  if (!(await userExists(userId))) throw new AppError('USER_NOT_FOUND', 404, 'User tidak ditemukan');
  if (await repo.find(reviewId, userId)) throw new AppError('ALREADY_LIKED', 409, 'User sudah me-like review ini');
  return repo.createAndSync(reviewId, userId);
}

export async function remove(reviewIdParam: unknown, userIdParam: unknown) {
  const reviewId = toId(reviewIdParam, 'reviewId');
  const userId = toId(userIdParam, 'userId');
  const existing = await repo.find(reviewId, userId);
  if (!existing) throw new AppError('LIKE_NOT_FOUND', 404, 'Like tidak ditemukan');
  await repo.removeAndSync(reviewId, userId);
  return existing;
}
