import { Router } from 'express';
import * as ctrl from '../controllers/likeController.ts';

const router = Router();

router.post('/', (req, res) => {
  /* 
    #swagger.tags = ['Likes']
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Payload like',
      required: true,
      schema: { reviewId: 1, userId: 1 }
    }
  */
  return ctrl.create(req, res);
});
router.delete('/:reviewId/:userId', (req, res) => {
  /* #swagger.tags = ['Likes']
  */
  return ctrl.remove(req, res);
});

export default router;
