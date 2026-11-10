import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';

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

router.delete('/:id', authenticate, authorize('admin'), (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.security = [{ "bearerAuth": [] }]
  */
  return ctrl.remove(req, res);
});

export default router;