import { AppError } from './errors.ts';

export const bad = (msg: string) => new AppError('VALIDATION_ERROR', 400, msg);

export function toId(v: unknown, label = 'id'): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n <= 0) throw bad(`${label} tidak valid`);
  return n;
}

export function reqString(b: any, f: string, max: number): string {
  const v = b?.[f];
  if (typeof v !== 'string' || !v.trim()) throw bad(`${f} wajib diisi`);
  if (v.trim().length > max) throw bad(`${f} maksimal ${max} karakter`);
  return v.trim();
}

/** undefined = tidak dikirim, null = dikosongkan */
export function optString(b: any, f: string, max: number): string | null | undefined {
  const v = b?.[f];
  if (v === undefined) return undefined;
  if (v === null || v === '') return null;
  if (typeof v !== 'string') throw bad(`${f} harus berupa teks`);
  if (v.trim().length > max) throw bad(`${f} maksimal ${max} karakter`);
  return v.trim();
}

export function reqInt(b: any, f: string, min: number, max = 2147483647): number {
  const v = b?.[f];
  if (!Number.isInteger(v) || v < min || v > max) throw bad(`${f} harus bilangan bulat ${min}-${max}`);
  return v;
}

export function optBool(b: any, f: string): boolean | undefined {
  const v = b?.[f];
  if (v === undefined) return undefined;
  if (typeof v !== 'boolean') throw bad(`${f} harus boolean`);
  return v;
}

export function paging(q: any) {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 10));
  return { page, limit, offset: (page - 1) * limit };
}
