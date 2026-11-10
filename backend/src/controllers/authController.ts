import type { Request, Response } from 'express';
import * as service from '../services/authService.ts';

export async function register(_req: Request, res: Response) {
  const data = await service.register(res.locals.valid.body);
  return res.status(201).json({ status: 'success', data });
}

export async function login(_req: Request, res: Response) {
  const data = await service.login(res.locals.valid.body);
  return res.status(200).json({ status: 'success', data });
}

export async function me(req: Request, res: Response) {
  const data = await service.me(req.user!.id);
  return res.status(200).json({ status: 'success', data });
}