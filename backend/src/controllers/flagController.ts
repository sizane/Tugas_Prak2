import type { Request, Response } from 'express';
import * as service from '../services/flagService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try {
    const data = await service.list(req.query);
    return res.status(200).json({ status: 'success', data });
  } catch (e) {
    handleError(res, e);
  }
}

export async function updateStatus(req: Request, res: Response) {
  try {
    const data = await service.updateStatus(req.params.id, req.body);
    return res.status(200).json({ status: 'success', data });
  } catch (e) {
    handleError(res, e);
  }
}

export async function createForReview(req: Request, res: Response) {
  try {
    const { params, body } = res.locals.valid;
    const data = await service.createForReview(params.id, req.user!.id, body);
    return res.status(201).json({ status: 'success', data });
  } catch (e) {
    handleError(res, e);
  }
}
