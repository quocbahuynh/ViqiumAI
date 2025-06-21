import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Chatbot API',
      version: '1.0.0',
      description: 'API documentation for your project',
    },
    servers: [
      {
        url: process.env.BACKEND_URL, // Change this to your actual server URL
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // This specifies that JWT tokens will be used
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply bearerAuth globally to all routes
      },
    ],
  },
  apis: ['./routes/*.js'], // Files containing annotations for the Swagger docs
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true, // Enables token persistence
    },
  }));
};

export default setupSwagger;
