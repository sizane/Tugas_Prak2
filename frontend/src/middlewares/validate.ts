import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError, type FieldError } from '../utils/errors.ts';

type Schemas = { params?: ZodType; query?: ZodType; body?: ZodType };

export const validate = (schemas: Schemas): RequestHandler => (req, res, next) => {
  const errors: FieldError[] = [];
  const valid: Record<string, any> = {};

  for (const key of ['params', 'query', 'body'] as const) {
    const schema = schemas[key];
    if (!schema) continue;
    const result = schema.safeParse(req[key] ?? {});
    if (result.success) {
      valid[key] = result.data;
      continue;
    }
    for (const issue of result.error.issues as any[]) {
      const field = issue.path.join('.') || key;
      let message: string = issue.message;
      if (issue.code === 'invalid_type') {
        message = /undefined|Required/i.test(message) ? `${field} wajib diisi` : `${field} tidak valid`;
      }
      errors.push({ field, message });
    }
  }

  if (errors.length) return next(new AppError('VALIDATION_ERROR', 400, 'Validasi gagal', errors));
  res.locals.valid = valid; // JANGAN assign ke req.query: di Express 5 itu read-only
  next();
};