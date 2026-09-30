import { type Request, type Response } from 'express';
import { validateUserDto, type CreateUserDto } from '../dtos/userDto.ts';

export const createUser = async (req: Request, res: Response) => {
  // 1. Jalankan validasi
  const { isValid, errors } = validateUserDto(req.body);

  if (!isValid) {
    return res.status(400).json({
      status: 'error',
      message: 'Validasi gagal',
      errors,
    });
  }

  // 2. Lanjut ke proses simpan/service
  const userData: CreateUserDto = req.body;
  // ...
};