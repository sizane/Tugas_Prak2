import { type Request, type Response } from 'express';
import { validateCreateMenuItem } from '../dtos/menuItemDto.ts';
import * as menuItemService from '../services/menuItemService.ts';

export const createMenuItem = async (req: Request, res: Response) => {
  try {
    // 1. Validasi input
    const { isValid, errors } = validateCreateMenuItem(req.body);
    if (!isValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Validasi gagal',
        errors,
      });
    }

    // 2. Eksekusi service
    const newItem = await menuItemService.create(req.body);
    return res.status(201).json({
      status: 'success',
      data: newItem,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan pada server',
      error: error?.message || String(error),
    });
  }
};