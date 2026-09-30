import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: { title: 'Review Kantin API', version: '1.0.0' },
  servers: [{ url: 'http://localhost:3000' }],
  definitions: {
    StallInput: {
      $ownerId: 2,
      $name: 'Warung Baru',
      category: 'Nasi',
      location: 'Kantin FK',
      description: '',
    },
  },
};
export const schemas = {
  UserInput: {
    type: 'object',
    required: ['name', 'email', 'password'],
    properties: {
      name: { type: 'string', example: 'Budi Santoso' },
      email: { type: 'string', example: 'budi@mail.com' },
      password: { type: 'string', example: 'rahasia123' },
      role: { type: 'string', enum: ['admin', 'owner', 'customer'], example: 'customer' },
    },
  },
  MenuItemInput: {
    type: 'object',
    required: ['stallId', 'name', 'price'],
    properties: {
      stallId: { type: 'integer', example: 1 },
      name: { type: 'string', example: 'Nasi Pecel' },
      price: { type: 'integer', minimum: 0, example: 12000 },
      isAvailable: { type: 'boolean', example: true },
    },
  },
  ReviewInput: {
    type: 'object',
    required: ['stallId', 'userId', 'rating'],
    properties: {
      stallId: { type: 'integer', example: 1 },
      userId: { type: 'integer', example: 3 },
      rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
      comment: { type: 'string', example: 'Porsi banyak, harga bersahabat.' },
    },
  },
  LikeInput: {
    type: 'object',
    required: ['reviewId', 'userId'],
    properties: { reviewId: { type: 'integer', example: 1 }, userId: { type: 'integer', example: 2 } },
  },
  FlagStatusInput: {
    type: 'object',
    required: ['status'],
    properties: { status: { type: 'string', enum: ['pending', 'resolved', 'dismissed'], example: 'resolved' } },
  },
  AuditLogInput: {
    type: 'object',
    required: ['userId', 'action', 'targetTable', 'targetId'],
    properties: {
      userId: { type: 'integer', example: 1 },
      action: { type: 'string', example: 'DELETE_REVIEW' },
      targetTable: { type: 'string', example: 'REVIEWS' },
      targetId: { type: 'integer', example: 5 },
      metadata: { type: 'object', example: { reason: 'spam' } },
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen()(outputFile, endpointsFiles, doc);
