import { Router } from 'express';
import * as ctrl from '../controllers/likeController.ts';

const router = Router();

router.post('/', (req, res) => {
  /* #swagger.tags = ['Likes']
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LikeInput" } } } }
  */
  return ctrl.create(req, res);
});

router.delete('/:reviewId/:userId', (req, res) => {
  /* #swagger.tags = ['Likes']
  */
  return ctrl.remove(req, res);
});

export default router;
