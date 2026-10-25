import { z } from 'zod';

export const idParams = z.object({
  id: z.coerce.number().int('id harus bilangan bulat').positive('id harus lebih dari 0'),
});

// Stalls
export const listStallsQuery = z.object({
  search: z.string().trim().max(100, 'search maksimal 100 karakter').optional(),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  page: z.coerce.number().int('page harus bilangan bulat').min(1, 'page minimal 1').default(1),
  limit: z.coerce.number().int('limit harus bilangan bulat').min(1, 'limit minimal 1').max(100, 'limit maksimal 100').default(10),
});

export const createStallBody = z.object({
  name: z.string().trim().min(3, 'name minimal 3 karakter').max(100, 'name maksimal 100 karakter'),
  category: z.string().trim().max(50, 'category maksimal 50 karakter').optional(),
  location: z.string().max(100, 'location maksimal 100 karakter').optional(),
  description: z.string().max(1000, 'description maksimal 1000 karakter').optional(),
});
export const updateStallBody = createStallBody.partial();

// Reviews
export const createReviewBody = z.object({
  rating: z.number().int('rating harus bilangan bulat').min(1, 'rating minimal 1').max(5, 'rating maksimal 5'),
  comment: z.string().trim().max(1000, 'comment maksimal 1000 karakter').optional(),
});

// Auth
const email = z.string().trim().toLowerCase().pipe(z.email('format email tidak valid'));

export const registerBody = z.object({
  name: z.string().trim().min(3, 'name minimal 3 karakter').max(100, 'name maksimal 100 karakter'),
  email: z.string().trim().toLowerCase().max(150, 'email maksimal 150 karakter').pipe(z.email('format email tidak valid')),
  password: z.string().min(8, 'password minimal 8 karakter').max(72, 'password maksimal 72 karakter'),
});

export const loginBody = z.object({
  email,
  password: z.string().min(1, 'password wajib diisi'),
});