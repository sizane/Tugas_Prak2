import type { Request, Response } from 'express';
import * as service from '../services/auditLogService.ts';
import { handleError } from '../utils/errors.ts';

export async function list(req: Request, res: Response) {
  try {
    const data = await service.list(req.query);
    return res.status(200).json({
      status: 'success',
      data,
    });
  } catch (e) {
    handleError(res, e);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const data = await service.create(req.body);
    return res.status(201).json({
      status: 'success',
      data,
    });
  } catch (e) {
    handleError(res, e);
  }
}