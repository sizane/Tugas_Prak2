import { Router } from 'express';
import * as ctrl from '../controllers/likeController.ts';

const router = Router();

router.post('/', (req, res) => {
  /* #swagger.tags = ['Likes']
     #swagger.summary = 'Like sebuah review (like_count review ikut bertambah)'
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LikeInput" } } } }
  */
  return ctrl.create(req, res);
});

router.delete('/:reviewId/:userId', (req, res) => {
  /* #swagger.tags = ['Likes']
     #swagger.summary = 'Batalkan like (like_count review ikut berkurang)'
  */
  return ctrl.remove(req, res);
});

export default router;
