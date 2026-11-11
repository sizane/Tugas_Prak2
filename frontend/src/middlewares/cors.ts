import type { RequestHandler } from 'express';

// Izinkan frontend (mis. Vite di http://localhost:5173) memanggil API dengan header Authorization.
// Atur origin lewat CORS_ORIGIN di .env (pisahkan dengan koma bila lebih dari satu).
const allowed = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

export const corsMiddleware: RequestHandler = (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
};
