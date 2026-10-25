import { Router } from 'express';
import * as ctrl from '../controllers/userController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';

const router = Router();
router.use(authenticate, authorize('admin'));

router.get('/', (req, res) => {
  /* #swagger.tags = ['Users']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['search'] = { in: 'query', description: 'Cari nama / email' }
     #swagger.parameters['role'] = { in: 'query', description: 'admin | owner | customer' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.tags = ['Users']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserInput" } } } }
  */
  return ctrl.create(req, res);
});

export default router;
