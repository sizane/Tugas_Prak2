import type { Response } from 'express';

export type FieldError = { field: string; message: string };

export class AppError extends Error {
  constructor(
    public code: string,
    public status: number,
    message?: string,
    public errors?: FieldError[],
  ) {
    super(message ?? code);
  }
}

export function handleError(res: Response, err: any) {
  if (err instanceof AppError) {
    return res.status(err.status).json({
      status: 'fail',
      message: err.message,
      ...(err.errors ? { errors: err.errors } : {}),
    });
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ status: 'fail', message: 'Body JSON tidak valid' });
  }
  const n = err?.number ?? err?.cause?.number ?? err?.originalError?.number;
  if (n === 2627 || n === 2601) return res.status(409).json({ status: 'fail', message: 'Data sudah ada' });
  if (n === 547) return res.status(409).json({ status: 'fail', message: 'Data masih dipakai / referensi tidak valid' });
  console.error(err);
  return res.status(500).json({ status: 'error', message: 'Terjadi kesalahan pada server' });
}