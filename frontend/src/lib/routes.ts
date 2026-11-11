import type { UserRole } from '../types/api.ts';

export function homeForRole(role: UserRole): string {
  if (role === 'admin' || role === 'owner') return '/manage';
  return '/';
}