import type { Request, Response } from 'express';
import * as service from '../services/auditLogService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try { res.json(await service.list(req.query)); } catch (e) { handleError(res, e); }
}
export async function create(req: Request, res: Response) {
  try { res.status(201).json({ data: await service.create(req.body) }); } catch (e) { handleError(res, e); }
}
