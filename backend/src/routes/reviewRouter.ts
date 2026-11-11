import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.ts';
import * as likeCtrl from '../controllers/likeController.ts';
import * as flagCtrl from '../controllers/flagController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import { idParams, createFlagBody } from '../schemas/index.ts';

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

router.post('/:id/like', authenticate, authorize('customer'), validate({ params: idParams }), (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
     #swagger.responses[200] = { description: 'Review di-like' }
     #swagger.responses[403] = { description: 'Hanya customer' }
     #swagger.responses[404] = { description: 'Review tidak ditemukan' }
  */
  return likeCtrl.likeReview(req, res);
});

router.delete('/:id/like', authenticate, authorize('customer'), validate({ params: idParams }), (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
     #swagger.responses[200] = { description: 'Like dibatalkan' }
     #swagger.responses[403] = { description: 'Hanya customer' }
     #swagger.responses[404] = { description: 'Review tidak ditemukan' }
  */
  return likeCtrl.unlikeReview(req, res);
});

router.post('/:id/flags', authenticate, authorize('customer'), validate({ params: idParams, body: createFlagBody }), (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
     #swagger.requestBody = { required: false, content: { "application/json": { schema: { type: "object", properties: { reason: { type: "string", example: "Mengandung ujaran kebencian" } } } } } }
     #swagger.responses[201] = { description: 'Laporan dibuat (status pending)' }
     #swagger.responses[400] = { description: 'Validasi gagal' }
     #swagger.responses[403] = { description: 'Bukan customer / review milik sendiri' }
     #swagger.responses[404] = { description: 'Review tidak ditemukan' }
     #swagger.responses[409] = { description: 'Sudah pernah melaporkan' }
  */
  return flagCtrl.createForReview(req, res);
});

export default router;