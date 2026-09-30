import type { Request, Response } from 'express';
import * as service from '../services/reviewService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try { res.json(await service.list(req.query)); } catch (e) { handleError(res, e); }
}
export async function create(req: Request, res: Response) {
  try { res.status(201).json({ data: await service.create(req.body) }); } catch (e) { handleError(res, e); }
}
export async function remove(req: Request, res: Response) {
  try { res.json({ message: 'Review dihapus', data: await service.remove(req.params.id) }); } catch (e) { handleError(res, e); }
}
