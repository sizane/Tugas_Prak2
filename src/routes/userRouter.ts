import { Router } from 'express';
import * as ctrl from '../controllers/userController.ts';

const router = Router();

router.get('/', (req, res) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Daftar user (tanpa password hash)'
     #swagger.parameters['search'] = { in: 'query', description: 'Cari nama / email' }
     #swagger.parameters['role'] = { in: 'query', description: 'admin | owner | customer' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.tags = ['Users']
     #swagger.summary = 'Buat user'
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UserInput" } } } }
  */
  return ctrl.create(req, res);
});

export default router;
