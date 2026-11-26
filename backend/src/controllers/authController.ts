import type { Request, Response } from 'express';
import * as service from '../services/authService.ts';

export async function register(_req: Request, res: Response) {
  const data = await service.register(res.locals.valid.body);
  return res.status(201).json({ status: 'success', data });
}

export async function login(req: Request, res: Response) {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const userAgent = req.headers['user-agent'] ?? 'unknown';
  const data = await service.login(res.locals.valid.body, ip, userAgent);
  return res.status(200).json({ status: 'success', data });
}

export async function logout(req: Request, res: Response) {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const userAgent = req.headers['user-agent'] ?? 'unknown';
  await service.logout(req.user!, ip, userAgent);
  return res.status(200).json({
    status: 'success',
    message: 'Berhasil keluar.',
    data: { loggedOut: true },
  });
}

export async function me(req: Request, res: Response) {
  const data = await service.me(req.user!.id);
  return res.status(200).json({ status: 'success', data });
}
