import { Router } from 'express';
import * as ctrl from '../controllers/menuItemController.ts';

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

router.post('/', (req, res) => {
  /* #swagger.tags = ['Menu Items']
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MenuItemInput" } } } }
  */
  return ctrl.create(req, res);
});

router.put('/:id', (req, res) => {
  /* #swagger.tags = ['Menu Items']
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/MenuItemInput" } } } }
  */
  return ctrl.update(req, res);
});

router.delete('/:id', (req, res) => {
  /* #swagger.tags = ['Menu Items']
  */
  return ctrl.remove(req, res);
});

export default router;
