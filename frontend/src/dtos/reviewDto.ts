import { optString, reqInt, toId } from '../utils/validate.ts';

export type CreateReviewDto = { stallId: number; userId: number; rating: number; comment: string | null };

export function parseCreateReview(b: any): CreateReviewDto {
  return {
    stallId: toId(b?.stallId, 'stallId'),
    userId: toId(b?.userId, 'userId'),
    rating: reqInt(b, 'rating', 1, 5),
    comment: optString(b, 'comment', 100000) ?? null,
  };
}
