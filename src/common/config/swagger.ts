import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = {
  title: 'QT API',
  description: 'Swagger documentation for QT API',
  version: '1.0.0',
};

export const options = new DocumentBuilder()
  .setTitle(swaggerOptions.title)
  .setDescription(swaggerOptions.description)
  .setVersion(swaggerOptions.version)
  .addServer('http://localhost:3000/', 'Local server')
  .build();

export const url = 'swagger-docs';
