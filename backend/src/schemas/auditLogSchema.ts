import { z } from 'zod';

const dateOnly = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Gunakan format tanggal YYYY-MM-DD.')
  .refine((value) => {
    const date = new Date(`${value}T00:00:00`);
    if (Number.isNaN(date.getTime())) return false;
    const [year, month, day] = value.split('-').map(Number);
    return (
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day
    );
  }, 'Tanggal tidak valid.');

export const auditLogQuerySchema = z
  .object({
    page: z.coerce.number().int('page harus bilangan bulat').min(1, 'page minimal 1').default(1),
    pageSize: z.coerce.number().int('pageSize harus bilangan bulat').min(1, 'pageSize minimal 1').max(100, 'pageSize maksimal 100').default(20),
    action: z.string().trim().max(50, 'action maksimal 50 karakter').optional(),
    targetTable: z.string().trim().max(50, 'targetTable maksimal 50 karakter').optional(),
    targetId: z.coerce.number().int('targetId harus bilangan bulat').positive('targetId harus positif').optional(),
    userId: z.coerce.number().int('userId harus bilangan bulat').positive('userId harus positif').optional(),
    from: dateOnly.optional(),
    to: dateOnly.optional(),
  })
  .strict('Parameter yang tidak dikenal tidak diizinkan.')
  .refine(
    (value) => !value.from || !value.to || value.from <= value.to,
    {
      message: 'Tanggal awal (from) tidak boleh melewati tanggal akhir (to).',
      path: ['from'],
    },
  );

export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
