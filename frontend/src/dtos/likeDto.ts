import { toId } from '../utils/validate.ts';

export type LikeDto = { reviewId: number; userId: number };

export function parseLike(b: any): LikeDto {
  return { reviewId: toId(b?.reviewId, 'reviewId'), userId: toId(b?.userId, 'userId') };
}
