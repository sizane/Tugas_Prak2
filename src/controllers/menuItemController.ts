import type { Request, Response } from 'express';
import * as service from '../services/menuItemService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try { res.json(await service.list(req.query)); } catch (e) { handleError(res, e); }
}
export async function get(req: Request, res: Response) {
  try { res.json({ data: await service.get(req.params.id) }); } catch (e) { handleError(res, e); }
}
export async function create(req: Request, res: Response) {
  try { res.status(201).json({ data: await service.create(req.body) }); } catch (e) { handleError(res, e); }
}
export async function update(req: Request, res: Response) {
  try { res.json({ data: await service.update(req.params.id, req.body) }); } catch (e) { handleError(res, e); }
}
export async function remove(req: Request, res: Response) {
  try { res.json({ message: 'Menu dihapus', data: await service.remove(req.params.id) }); } catch (e) { handleError(res, e); }
}
