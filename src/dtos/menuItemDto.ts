import { AppError } from '../utils/errors.ts';
import { optBool, reqInt, reqString, toId } from '../utils/validate.ts';

export type CreateMenuItemDto = { stallId: number; name: string; price: number; isAvailable: boolean };
export type UpdateMenuItemDto = Partial<CreateMenuItemDto>;

export function parseCreateMenuItem(b: any): CreateMenuItemDto {
  return {
    stallId: toId(b?.stallId, 'stallId'),
    name: reqString(b, 'name', 100),
    price: reqInt(b, 'price', 0),
    isAvailable: optBool(b, 'isAvailable') ?? true,
  };
}

export function parseUpdateMenuItem(b: any): UpdateMenuItemDto {
  const out: UpdateMenuItemDto = {};
  if (b?.stallId !== undefined) out.stallId = toId(b.stallId, 'stallId');
  if (b?.name !== undefined) out.name = reqString(b, 'name', 100);
  if (b?.price !== undefined) out.price = reqInt(b, 'price', 0);
  if (b?.isAvailable !== undefined) out.isAvailable = optBool(b, 'isAvailable');
  if (!Object.keys(out).length) throw new AppError('VALIDATION_ERROR', 400, 'Tidak ada field yang diubah');
  return out;
}
