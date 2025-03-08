import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
export interface Config {
  cors: CorsOptions;
  swagger: SwaggerConfig;
  security: SecurityConfig;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}
