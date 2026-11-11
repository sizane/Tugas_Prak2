import * as repo from '../repositories/userRepository.ts';
import { parseCreateUser } from '../dtos/userDto.ts';
import { AppError } from '../utils/errors.ts';
import { hashPassword } from '../utils/password.ts';
import { paging } from '../utils/validate.ts';

export async function list(q: any) {
  const pg = paging(q);
  const { rows, total } = await repo.findAll({
    search: q.search ? String(q.search) : undefined,
    role: q.role ? String(q.role) : undefined,
    ...pg,
  });
  return { data: rows, meta: { page: pg.page, limit: pg.limit, total } };
}

export async function create(body: any) {
  const { password, ...rest } = parseCreateUser(body);
  if (await repo.findByEmail(rest.email)) throw new AppError('EMAIL_TAKEN', 409, 'Email sudah terdaftar');
  return repo.create({ ...rest, passwordHash: hashPassword(password) });
}
