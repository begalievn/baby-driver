import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';
import { ormConfigName } from './infrastructure/consts/database';

dotenvConfig({ path: '.env' });

export const connectionConfig: DataSourceOptions = {
  type: 'postgres',
  host: `${process.env.DB_HOST}`,
  port: +process.env.DB_PORT || 5432,
  username: `${process.env.DB_USERNAME}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/db/migrations/**/*{.ts,.js}'],
  synchronize: false,
};

export default registerAs(ormConfigName, () => connectionConfig);
export const connectionSource = new DataSource(connectionConfig);
