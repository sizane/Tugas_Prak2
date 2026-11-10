import type { RequestHandler } from 'express';
import { AppError } from '../utils/errors.ts';
import { verifyToken, type AuthUser, type Role } from '../utils/jwt.ts';

declare global {
  namespace Express {
    interface Request { user?: AuthUser }
  }
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('UNAUTHORIZED', 401, 'Token tidak ditemukan'));
  }
  try {
    const p = verifyToken(header.slice(7));
    req.user = { id: Number(p.id), role: p.role };
    next();
  } catch {
    next(new AppError('UNAUTHORIZED', 401, 'Token tidak valid atau kedaluwarsa'));
  }
};

export const authorize = (...roles: Role[]): RequestHandler => (req, _res, next) => {
  if (!req.user) return next(new AppError('UNAUTHORIZED', 401, 'Belum login'));
  if (!roles.includes(req.user.role)) {
    return next(new AppError('FORBIDDEN', 403, 'Anda tidak punya akses ke resource ini'));
  }
  next();
};