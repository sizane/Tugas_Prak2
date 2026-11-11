import { Router } from 'express';
import * as ctrl from '../controllers/menuItemController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';

const router = Router();

router.get('/', (req, res) => {
  /* #swagger.tags = ['Menu Items']
     #swagger.parameters['stallId'] = { in: 'query', description: 'Filter per kedai' }
     #swagger.parameters['search'] = { in: 'query', description: 'Cari nama menu' }
     #swagger.parameters['available'] = { in: 'query', description: 'true | false' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.get('/:id', (req, res) => {
  /* #swagger.tags = ['Menu Items']
  */
  return ctrl.get(req, res);
});

router.post('/', authenticate, authorize('owner', 'admin'), (req, res) => {
  /* #swagger.tags = ['Menu Items']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MenuItemInput" } } } }
  */
  return ctrl.create(req, res);
});

router.put('/:id', authenticate, authorize('owner', 'admin'), (req, res) => {
  /* #swagger.tags = ['Menu Items']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MenuItemInput" } } } }
  */
  return ctrl.update(req, res);
});

router.delete('/:id', authenticate, authorize('owner', 'admin'), (req, res) => {
  /* #swagger.tags = ['Menu Items']
     #swagger.security = [{ "bearerAuth": [] }]
  */
  return ctrl.remove(req, res);
});

export default router;
