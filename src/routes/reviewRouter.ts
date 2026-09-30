import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.ts';

const router = Router();

router.get('/', (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.parameters['stallId'] = { in: 'query', description: 'Filter per kedai' }
     #swagger.parameters['userId'] = { in: 'query', description: 'Filter per user' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewInput" } } } }
  */
  return ctrl.create(req, res);
});

router.delete('/:id', (req, res) => {
  /* #swagger.tags = ['Reviews']
  */
  return ctrl.remove(req, res);
});

export default router;
