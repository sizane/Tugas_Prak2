import * as repo from '../repositories/menuItemRepository.ts';
import { stallExists } from '../repositories/lookupRepository.ts';
import { parseCreateMenuItem, parseUpdateMenuItem } from '../dtos/menuItemDto.ts';
import { AppError } from '../utils/errors.ts';
import { paging, toId } from '../utils/validate.ts';

const notFound = () => new AppError('MENU_ITEM_NOT_FOUND', 404, 'Menu tidak ditemukan');
const stallNotFound = () => new AppError('STALL_NOT_FOUND', 404, 'Kedai tidak ditemukan');

export async function list(q: any, stallIdFromPath?: unknown) {
  const pg = paging(q);
  const stallId = stallIdFromPath ? toId(stallIdFromPath, 'stallId') : q.stallId ? toId(q.stallId, 'stallId') : undefined;
  const { rows, total } = await repo.findAll({
    stallId,
    search: q.search ? String(q.search) : undefined,
    available: q.available === undefined ? undefined : q.available === 'true',
    ...pg,
  });
  return { data: rows, meta: { page: pg.page, limit: pg.limit, total } };
}

export async function get(idParam: unknown) {
  const item = await repo.findById(toId(idParam));
  if (!item) throw notFound();
  return item;
}

export async function create(body: any) {
  const dto = parseCreateMenuItem(body);
  if (!(await stallExists(dto.stallId))) throw stallNotFound();
  return repo.create(dto);
}

export async function update(idParam: unknown, body: any) {
  const id = toId(idParam);
  if (!(await repo.findById(id))) throw notFound();
  const dto = parseUpdateMenuItem(body);
  if (dto.stallId !== undefined && !(await stallExists(dto.stallId))) throw stallNotFound();
  return repo.update(id, dto);
}

export async function remove(idParam: unknown) {
  const id = toId(idParam);
  const item = await repo.findById(id);
  if (!item) throw notFound();
  await repo.remove(id);
  return item;
}
