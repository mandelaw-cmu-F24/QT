import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = {
  title: 'URL Shortener API',
  description: 'API for managing shortened URLs and user accounts',
  version: '1.0.0',
};

export const options = new DocumentBuilder()
  .setTitle(swaggerOptions.title)
  .setDescription(swaggerOptions.description)
  .setVersion(swaggerOptions.version)
  .addServer('http://localhost:3000/', 'Local server')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    },
    'access-token',
  )
  .build();

export const url = 'api-docs';
