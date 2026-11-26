import * as repo from '../repositories/userRepository.ts';
import { AppError } from '../utils/errors.ts';
import { hashPassword, verifyPassword } from '../utils/password.ts';
import { signToken } from '../utils/jwt.ts';
import { recordBestEffort } from './auditLogService.ts';

export async function register(dto: { name: string; email: string; password: string }) {
  if (await repo.findByEmail(dto.email)) throw new AppError('EMAIL_TAKEN', 409, 'Email sudah terdaftar');
  return repo.create({ name: dto.name, email: dto.email, passwordHash: hashPassword(dto.password), role: 'customer' });
}

export async function login(dto: { email: string; password: string }, ipAddress: string, userAgent: string) {
  const u = await repo.findForLogin(dto.email);
  if (!u || !verifyPassword(dto.password, u.passwordHash)) {
    throw new AppError('INVALID_CREDENTIALS', 401, 'Email atau password salah');
  }
  const token = signToken({ id: u.id, role: u.role });

  // Best-effort audit: kegagalan menulis audit tidak boleh menggagalkan login
  await recordBestEffort({
    userId: u.id,
    action: 'LOGIN',
    targetTable: 'USERS',
    targetId: u.id,
    metadata: {
      role: u.role,
      ip_address: ipAddress,
      user_agent: userAgent,
      result: 'success',
    },
  });

  return { token, user: { id: u.id, name: u.name, email: u.email, role: u.role } };
}

export async function logout(user: { id: number; role: string }, ipAddress: string, userAgent: string) {
  // Best-effort audit: kegagalan menulis audit tidak boleh menggagalkan logout
  await recordBestEffort({
    userId: user.id,
    action: 'LOGOUT',
    targetTable: 'USERS',
    targetId: user.id,
    metadata: {
      role: user.role,
      ip_address: ipAddress,
      user_agent: userAgent,
      result: 'success',
    },
  });
}

export async function me(id: number) {
  const u = await repo.findById(id);
  if (!u) throw new AppError('USER_NOT_FOUND', 404, 'User tidak ditemukan');
  return u;
}
