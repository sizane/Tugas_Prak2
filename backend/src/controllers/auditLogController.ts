import type { Request, Response } from 'express';
import * as service from '../services/auditLogService.ts';
import { auditLogQuerySchema } from '../schemas/auditLogSchema.ts';
import { AppError, handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try {
    const result = auditLogQuerySchema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.length > 0 ? String(issue.path[0]) : 'query',
        message: issue.message,
      }));
      throw new AppError('VALIDATION_ERROR', 400, 'Parameter filter audit tidak valid', errors);
    }
    const data = await service.list(result.data);
    return res.status(200).json({ status: 'success', data });
  } catch (e) {
    handleError(res, e);
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new AppError('VALIDATION_ERROR', 400, 'id tidak valid');
    }
    const data = await service.getById(id);
    return res.status(200).json({ status: 'success', data });
  } catch (e) {
    handleError(res, e);
  }
}
