import * as repo from '../repositories/userRepository.ts';
import { AppError } from '../utils/errors.ts';
import { hashPassword, verifyPassword } from '../utils/password.ts';
import { signToken } from '../utils/jwt.ts';

export async function register(dto: { name: string; email: string; password: string }) {
  if (await repo.findByEmail(dto.email)) throw new AppError('EMAIL_TAKEN', 409, 'Email sudah terdaftar');
  // role SELALU customer, tidak boleh dari body
  return repo.create({ name: dto.name, email: dto.email, passwordHash: hashPassword(dto.password), role: 'customer' });
}

export async function login(dto: { email: string; password: string }) {
  const u = await repo.findForLogin(dto.email);
  if (!u || !verifyPassword(dto.password, u.passwordHash)) {
    throw new AppError('INVALID_CREDENTIALS', 401, 'Email atau password salah');
  }
  const token = signToken({ id: u.id, role: u.role });
  return { token, user: { id: u.id, name: u.name, email: u.email, role: u.role } };
}

export async function me(id: number) {
  const u = await repo.findById(id);
  if (!u) throw new AppError('USER_NOT_FOUND', 404, 'User tidak ditemukan');
  return u;
}