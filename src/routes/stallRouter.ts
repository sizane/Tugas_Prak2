import { Router } from 'express';
import { StallController } from '../controllers/stallController.ts';
import { authenticate, authorize } from '../middlewares/auth.ts';
import { validate } from '../middlewares/validate.ts';
import * as reviewCtrl from '../controllers/reviewController.ts';
import { idParams, listStallsQuery, createStallBody, updateStallBody, createReviewBody } from '../schemas/index.ts';

const stallRouter = Router();
const stallController = new StallController();

stallRouter.get('/', validate({ query: listStallsQuery }), (req, res) => {
  // #swagger.parameters['search']   = { in: 'query', type: 'string' }
  // #swagger.parameters['category'] = { in: 'query', type: 'string' }
  // #swagger.parameters['page']     = { in: 'query', type: 'integer' }
  // #swagger.parameters['limit']    = { in: 'query', type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  return stallController.getStalls(req, res);
});

stallRouter.post('/',authenticate,authorize('owner', 'admin'),validate({ body: createStallBody }),(req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/StallInput" } } } }
    // #swagger.responses[201] = { description: 'Warung dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login' }
    // #swagger.responses[403] = { description: 'Role tidak punya akses' }
    return stallController.createStall(req, res);
  },
);

stallRouter.get('/:id', validate({ params: idParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Detail warung' }
  // #swagger.responses[400] = { description: 'Validasi gagal' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallById(req, res);
});

stallRouter.put('/:id',authenticate,authorize('owner', 'admin'),validate({ params: idParams, body: updateStallBody }),(req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/StallInput" } } } }
    // #swagger.responses[200] = { description: 'Warung ter-update' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login' }
    // #swagger.responses[403] = { description: 'Bukan pemilik warung / role tidak punya akses' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.updateStall(req, res);
  },
);

stallRouter.delete('/:id',authenticate,authorize('admin'),validate({ params: idParams }),(req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.responses[200] = { description: 'Warung terhapus' }
    // #swagger.responses[401] = { description: 'Belum login' }
    // #swagger.responses[403] = { description: 'Hanya admin' }
    // #swagger.responses[404] = { description: 'Tidak ditemukan' }
    return stallController.deleteStall(req, res);
  },
);

stallRouter.get('/:id/menus', validate({ params: idParams }), (req, res) => {
  // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
  // #swagger.responses[200] = { description: 'Daftar menu' }
  // #swagger.responses[404] = { description: 'Tidak ditemukan' }
  return stallController.getStallMenus(req, res);
});

stallRouter.post('/:id/reviews',authenticate,validate({ params: idParams, body: createReviewBody }),(req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewInput" } } } }
    // #swagger.responses[201] = { description: 'Review dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    // #swagger.responses[409] = { description: 'Sudah pernah mereview' }
    return reviewCtrl.createForStall(req, res);
  },
);
stallRouter.post('/:id/reviews',authenticate,validate({ params: idParams, body: createReviewBody }),(req, res) => {
    // #swagger.security = [{ "bearerAuth": [] }]
    // #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer' }
    // #swagger.requestBody = { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/ReviewInput" } } } }
    // #swagger.responses[201] = { description: 'Review dibuat' }
    // #swagger.responses[400] = { description: 'Validasi gagal' }
    // #swagger.responses[401] = { description: 'Belum login' }
    // #swagger.responses[404] = { description: 'Warung tidak ditemukan' }
    // #swagger.responses[409] = { description: 'Sudah pernah mereview' }
    return reviewCtrl.createForStall(req, res);
  },
);

export { stallRouter };
