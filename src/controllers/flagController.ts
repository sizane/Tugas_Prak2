import type { Request, Response } from 'express';
import * as service from '../services/flagService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try { res.json(await service.list(req.query)); } catch (e) { handleError(res, e); }
}
export async function updateStatus(req: Request, res: Response) {
  try { res.json({ data: await service.updateStatus(req.params.id, req.body) }); } catch (e) { handleError(res, e); }
}
