import type { ErrorRequestHandler, RequestHandler } from 'express';
import { handleError } from '../utils/errors.ts';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ status: 'fail', message: 'Endpoint tidak ditemukan' });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  handleError(res, err);
};