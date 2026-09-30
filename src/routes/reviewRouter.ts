import { Router } from 'express';
import * as ctrl from '../controllers/reviewController.ts';

const router = Router();

router.get('/', (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Daftar review + nama user (JOIN users)'
     #swagger.parameters['stallId'] = { in: 'query', description: 'Filter per kedai' }
     #swagger.parameters['userId'] = { in: 'query', description: 'Filter per user' }
     #swagger.parameters['page'] = { in: 'query' }
     #swagger.parameters['limit'] = { in: 'query' }
  */
  return ctrl.list(req, res);
});

router.post('/', (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Buat review (1 user 1 review per kedai). avg_rating & review_count kedai ikut diperbarui'
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewInput" } } } }
  */
  return ctrl.create(req, res);
});

router.delete('/:id', (req, res) => {
  /* #swagger.tags = ['Reviews']
     #swagger.summary = 'Hapus review (like & flag ikut terhapus, statistik kedai diperbarui)'
  */
  return ctrl.remove(req, res);
});

export default router;
