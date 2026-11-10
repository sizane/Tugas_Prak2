import { Router } from 'express';
import * as ctrl from '../controllers/auditLogController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';

const router = Router();
router.use(authenticate, authorize('admin'));
router.get('/', (req, res) => {
  /* #swagger.tags = ['Audit Logs']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['userId'] = { in: 'query' }
     #swagger.parameters['action'] = { in: 'query' }
     #swagger.parameters['targetTable'] = { in: 'query', description: 'mis. STALLS, REVIEWS' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.tags = ['Audit Logs']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AuditLogInput" } } } }
  */
  return ctrl.create(req, res);
});

export default router;
