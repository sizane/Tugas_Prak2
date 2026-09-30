import type { Response } from 'express';

/** Error bisnis: `code` mirip STALL_NOT_FOUND di contoh stall, `status` = HTTP status. */
export class AppError extends Error {
  constructor(public code: string, public status: number, message?: string) {
    super(message ?? code);
  }
}

export function handleError(res: Response, err: any) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.code, message: err.message });
  }
  const n = err?.number ?? err?.cause?.number ?? err?.originalError?.number;
  if (n === 2627 || n === 2601) return res.status(409).json({ error: 'DUPLICATE', message: 'Data sudah ada' });
  if (n === 547) return res.status(409).json({ error: 'CONSTRAINT_VIOLATION', message: 'Data masih dipakai / referensi tidak valid' });
  console.error(err);
  return res.status(500).json({ error: 'INTERNAL_ERROR', message: 'Terjadi kesalahan pada server' });
}
