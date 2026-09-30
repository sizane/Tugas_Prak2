import { Router } from 'express';
import * as ctrl from '../controllers/flagController.ts';

const router = Router();

router.get('/', (req, res) => {
  /* #swagger.tags = ['Flags']
     #swagger.summary = 'Daftar laporan + review + pelapor'
     #swagger.parameters['status'] = { in: 'query', description: 'pending | resolved | dismissed' }
     #swagger.parameters['reviewId'] = { in: 'query' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.put('/:id', (req, res) => {
  /* #swagger.tags = ['Flags']
     #swagger.summary = 'Update status laporan (pending | resolved | dismissed)'
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/FlagStatusInput" } } } }
  */
  return ctrl.updateStatus(req, res);
});

export default router;
