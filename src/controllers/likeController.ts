import type { Request, Response } from 'express';
import * as service from '../services/likeService.ts';
import { handleError } from '../utils/errors.ts';

export async function create(req: Request, res: Response) {
  try { res.status(201).json({ data: await service.create(req.body) }); } catch (e) { handleError(res, e); }
}
export async function remove(req: Request, res: Response) {
  try {
    res.json({ message: 'Like dihapus', data: await service.remove(req.params.reviewId, req.params.userId) });
  } catch (e) { handleError(res, e); }
}
