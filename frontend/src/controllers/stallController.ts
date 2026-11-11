import type { Request, Response } from 'express';
import { StallService } from '../services/stallService.ts';
import { handleError } from '../utils/errors.ts';

export class StallController {
  private stallService: StallService;

  constructor(stallService: StallService = new StallService()) {
    this.stallService = stallService;
  }

  getStalls = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const { page, limit, search, category } = res.locals.valid.query;
      const { data, total } = await this.stallService.getAllStalls({ search, category, page, limit });
      return res.status(200).json({ status: 'success', meta: { page, limit, total }, data });
    } catch (error) {
      return handleError(res, error);
    }
  };

  getStallById = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.getStallById(res.locals.valid.params.id);
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return handleError(res, error);
    }
  };

  getStallMenus = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const menus = await this.stallService.getStallMenus(res.locals.valid.params.id);
      return res.status(200).json({ status: 'success', data: menus });
    } catch (error) {
      return handleError(res, error);
    }
  };

  createStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      // ownerId dari TOKEN, bukan body
      const stall = await this.stallService.createStall({
        ...res.locals.valid.body,
        ownerId: req.user!.id,
      });
      return res.status(201).json({ status: 'success', data: stall });
    } catch (error) {
      return handleError(res, error);
    }
  };

  updateStall = async (req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.updateStall(
        res.locals.valid.params.id,
        res.locals.valid.body,
        req.user!,
      );
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return handleError(res, error);
    }
  };

  deleteStall = async (_req: Request, res: Response): Promise<Response> => {
    try {
      const stall = await this.stallService.deleteStall(res.locals.valid.params.id);
      return res.status(200).json({ status: 'success', data: stall });
    } catch (error) {
      return handleError(res, error);
    }
  };
}