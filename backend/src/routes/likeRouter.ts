import { Router } from 'express';
import * as ctrl from '../controllers/likeController.ts';
import { authenticate } from '../middlewares/auth.ts';


const router = Router();

router.post('/', authenticate,(req, res) => {
  /* #swagger.tags = ['Likes']
     #swagger.security = [{ "bearerAuth": [] }]
     #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/LikeInput" } } } }
  */
  return ctrl.create(req, res);
});
router.delete('/:reviewId/:userId', authenticate,(req, res) => {
  /* #swagger.tags = ['Likes']
     #swagger.security = [{ "bearerAuth": [] }]
  */
  return ctrl.remove(req, res);
});

export default router;
