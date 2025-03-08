import { DocumentBuilder } from '@nestjs/swagger';

const swaggerOptions = {
  title: 'KenteComfort API',
  description: 'Swagger documentation for KenteComfort API',
  version: '1.0.0',
};

export const options = new DocumentBuilder()
  .setTitle(swaggerOptions.title)
  .setDescription(swaggerOptions.description)
  .setVersion(swaggerOptions.version)
  .build();

export const url = 'swagger-docs';
