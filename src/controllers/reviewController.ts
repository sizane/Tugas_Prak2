import type { Request, Response } from 'express';
import * as service from '../services/reviewService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try {
    const data = await service.list(req.query);
    return res.status(200).json({ status: 'success', data });
  } catch (e) {
    handleError(res, e);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const data = await service.remove(req.params.id);
    return res.status(200).json({ status: 'success', message: 'Review dihapus', data });
  } catch (e) {
    handleError(res, e);
  }
}

export async function createForStall(req: Request, res: Response) {
  const { params, body } = res.locals.valid;
  const data = await service.createForStall(params.id, req.user!.id, body); // userId dari token
  return res.status(201).json({ status: 'success', data });
}