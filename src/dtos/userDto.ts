export interface CreateUserDto {
  username: string;
  email: string;
  password?: string;
  role?: string;
}

// Fungsi validasi langsung dibuat di sini
export function validateUserDto(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.username || typeof data.username !== 'string' || data.username.trim() === '') {
    errors.push('Username wajib diisi');
  }

  if (!data.email || typeof data.email !== 'string' || !data.email.includes('@')) {
    errors.push('Email tidak valid');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}