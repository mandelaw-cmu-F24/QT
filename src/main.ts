import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import * as swaggerConfig from './common/config/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { isRunningInProduction } from './common/utils/env.util';
import configuration from './common/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  // app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors(configuration().cors);
  if (!isRunningInProduction()) {
    const document = SwaggerModule.createDocument(app, swaggerConfig.options);
    SwaggerModule.setup(swaggerConfig.url, app, document);
  }
  await app.listen(process.env.PORT || 3000);
  Logger.warn(
    `The application is currently in ${
      process.env.NODE_ENV
    } and can be accessed at: ${await app.getUrl()}`,
  );
}
bootstrap();
