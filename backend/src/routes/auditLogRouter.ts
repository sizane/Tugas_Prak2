import { Router } from 'express';
import * as ctrl from '../controllers/auditLogController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';

const router = Router();
router.use(authenticate, authorize('admin'));

router.get('/', (req, res) => {
  /* #swagger.tags = ['Audit Logs']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['pageSize'] = { in: 'query' }
     #swagger.parameters['action'] = { in: 'query' }
     #swagger.parameters['targetTable'] = { in: 'query' }
     #swagger.parameters['targetId'] = { in: 'query' }
     #swagger.parameters['userId'] = { in: 'query' }
     #swagger.parameters['from'] = { in: 'query' }
     #swagger.parameters['to'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.get('/:id', (req, res) => {
  /* #swagger.tags = ['Audit Logs']
     #swagger.security = [{ "bearerAuth": [] }]
  */
  return ctrl.getById(req, res);
});

export default router;
