import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Review Kantin API',
    version: '1.0.0',
    description: 'API review kantin. Endpoint bergembok butuh JWT: login di POST /auth/login, lalu klik Authorize.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'fail' },
          message: { type: 'string', example: 'Validasi gagal' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string', example: 'password' },
                message: { type: 'string', example: 'password minimal 8 karakter' },
              },
            },
          },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100, example: 'Budi Santoso' },
          email: { type: 'string', format: 'email', maxLength: 150, example: 'budi@mail.com' },
          password: { type: 'string', minLength: 8, maxLength: 72, example: 'Password123' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'budi@kantin.test' },
          password: { type: 'string', example: 'Password123' },
        },
      },
      StallInput: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', minLength: 3, maxLength: 100, example: 'Warung Baru' },
          category: { type: 'string', maxLength: 50, example: 'Nasi' },
          location: { type: 'string', maxLength: 100, example: 'Kantin FK' },
          description: { type: 'string', maxLength: 1000, example: 'Menu rumahan' },
        },
      },
      ReviewInput: {
        type: 'object',
        required: ['rating'],
        properties: {
          rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 },
          comment: { type: 'string', maxLength: 1000, example: 'Porsi banyak, harga bersahabat.' },
        },
      },
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
      LikeInput: {
        type: 'object',
        required: ['reviewId'],
        properties: { reviewId: { type: 'integer', example: 1 } },
      },
      FlagStatusInput: {
        type: 'object',
        required: ['status'],
        properties: { status: { type: 'string', enum: ['pending', 'resolved', 'dismissed'], example: 'resolved' } },
      },
      AuditLogInput: {
        type: 'object',
        required: ['action', 'targetTable', 'targetId'],
        properties: {
          action: { type: 'string', example: 'DELETE_REVIEW' },
          targetTable: { type: 'string', example: 'REVIEWS' },
          targetId: { type: 'integer', example: 5 },
          metadata: { type: 'object', example: { reason: 'spam' } },
        },
      },
    },
  },
};

const outputFile = './src/docs/swagger-output.json';
const endpointsFiles = ['./src/index.ts'];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);