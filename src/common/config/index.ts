import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { UnauthorizedException } from '@nestjs/common';
import { dbconfig } from './typeorm';

interface iConfig {
  env: string;
  port: number;
  cors: CorsOptions;
  database: PostgresConnectionOptions;
  keys: {
    privateKey: string;
    publicKey: string;
  };
}

export default (): Partial<iConfig> => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  cors: {
    origin: (origin, callback) => {
      const whitelist = process.env.ALLOWED_ORIGINS.split(',') || [];
      const canAllowUndefinedOrigin =
        origin === undefined && process.env.NODE_ENV !== 'production';

      if (whitelist.indexOf(origin) !== -1 || canAllowUndefinedOrigin) {
        callback(null, true);
      } else {
        callback(
          new UnauthorizedException(`Not allowed by CORS for origin:${origin}`),
        );
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Set-Cookie',
      'Cookies',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range', 'Custom-Header'],
    credentials: true,
  },
  keys: {
    privateKey: process.env.PRIVATE_KEY.replace(/\\n/gm, '\n'),
    publicKey: process.env.PUBLIC_KEY.replace(/\\n/gm, '\n'),
  },
  database: dbconfig as PostgresConnectionOptions,
});
