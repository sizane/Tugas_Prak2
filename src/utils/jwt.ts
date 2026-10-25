import jwt from 'jsonwebtoken';

export type Role = 'admin' | 'owner' | 'customer';
export type AuthUser = { id: number; role: Role };

function secret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error('JWT_SECRET belum diset di .env');
  return s;
}

export const signToken = (u: AuthUser) =>
  jwt.sign(u, secret(), { expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as any });

export const verifyToken = (token: string) => jwt.verify(token, secret()) as AuthUser;