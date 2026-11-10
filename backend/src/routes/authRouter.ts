import { Router } from 'express';
import * as ctrl from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { registerBody, loginBody } from '../schemas/index.ts';

const router = Router();

router.post('/register', validate({ body: registerBody }), (req, res) => {
  /* #swagger.tags = ['Auth']
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterInput" } } } }
     #swagger.responses[201] = { description: 'Akun dibuat' }
     #swagger.responses[400] = { description: 'Validasi gagal', content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } }
     #swagger.responses[409] = { description: 'Email sudah terdaftar' }
  */
  return ctrl.register(req, res);
});

router.post('/login', validate({ body: loginBody }), (req, res) => {
  /* #swagger.tags = ['Auth']
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } } }
     #swagger.responses[200] = { description: 'Login berhasil, berisi token' }
     #swagger.responses[400] = { description: 'Validasi gagal' }
     #swagger.responses[401] = { description: 'Email atau password salah' }
  */
  return ctrl.login(req, res);
});

router.get('/me', authenticate, (req, res) => {
  /* #swagger.tags = ['Auth']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.responses[200] = { description: 'Data user dari token' }
     #swagger.responses[401] = { description: 'Token tidak ada / tidak valid' }
  */
  return ctrl.me(req, res);
});

export default router;