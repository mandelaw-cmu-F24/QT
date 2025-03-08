import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { isRunningInProduction } from '../utils/env.util';
import { join } from 'path';

dotenvConfig({ path: '.env' });

export const dbconfig = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: parseInt(process.env.POSTGRESDB_LOCAL_PORT, 10) || 5432,
  username: `${process.env.POSTGRESDB_USER}`,
  password: `${process.env.POSTGRESDB_ROOT_PASSWORD}`,
  database: `${process.env.POSTGRESDB_DATABASE}`,
  ssl: process.env.POSTGRES_SSL === 'true',
  migrationsRun: isRunningInProduction(),
  logging: !isRunningInProduction(),
  autoLoadEntities: true,
  synchronize: false,
  dropSchema: false,
  entities: ['dist/**/*.entity.js'],
  migrations: [join(__dirname, '../../migrations/**/*{.ts,.js}')],
};

export default registerAs('typeorm', () => dbconfig);
export const connectionSource = new DataSource(dbconfig as DataSourceOptions);
