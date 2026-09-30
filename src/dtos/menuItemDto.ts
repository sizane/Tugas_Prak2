export interface CreateMenuItemDto {
  stallId: number;
  name: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
}

export interface UpdateMenuItemDto {
  name?: string;
  price?: number;
  description?: string;
  isAvailable?: boolean;
}

// Fungsi validasi mandiri (tanpa dependensi file utils)
export function validateCreateMenuItem(body: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  const stallId = Number(body?.stallId);
  if (!Number.isInteger(stallId) || stallId <= 0) {
    errors.push('stallId tidak valid');
  }

  if (typeof body?.name !== 'string' || !body.name.trim()) {
    errors.push('name wajib diisi');
  } else if (body.name.trim().length > 100) {
    errors.push('name maksimal 100 karakter');
  }

  const price = Number(body?.price);
  if (isNaN(price) || price < 0) {
    errors.push('price harus berupa angka positif');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}