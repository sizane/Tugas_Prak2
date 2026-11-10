import { bad, reqString } from '../utils/validate.ts';

export const ROLES = ['admin', 'owner', 'customer'] as const;
export type UserRole = (typeof ROLES)[number];

export type CreateUserDto = { name: string; email: string; password: string; role: UserRole };

export function parseCreateUser(b: any): CreateUserDto {
  const email = reqString(b, 'email', 150).toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) throw bad('format email tidak valid');
  const password = reqString(b, 'password', 100);
  if (password.length < 6) throw bad('password minimal 6 karakter');
  const role = b?.role ?? 'customer';
  if (!ROLES.includes(role)) throw bad(`role harus salah satu dari: ${ROLES.join(', ')}`);
  return { name: reqString(b, 'name', 100), email, password, role };
}
