import { Router } from 'express';
import * as ctrl from '../controllers/authController.ts';
import { validate } from '../middlewares/validate.ts';
import { authenticate } from '../middlewares/auth.ts';
import { registerBody, loginBody } from '../schemas/index.ts';

const router = Router();

router.post('/register', validate({ body: registerBody }), (req, res) => {
  // #swagger.tags = ['Auth']
  return ctrl.register(req, res);
});

router.post('/login', validate({ body: loginBody }), (req, res) => {
  // #swagger.tags = ['Auth']
  return ctrl.login(req, res);
});

router.get('/me', authenticate, (req, res) => {
  // #swagger.tags = ['Auth']
  // #swagger.security = [{ "bearerAuth": [] }]
  return ctrl.me(req, res);
});

export default router;