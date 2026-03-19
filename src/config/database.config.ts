import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('database', (): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: `postgresql://postgres.${process.env.POSTGRES_HOST}:${encodeURIComponent(
    String(process.env.POSTGRES_PASSWORD))}@aws-1-eu-west-1.pooler.supabase.com:${process.env.POSTGRES_PORT}/postgres`,
  ssl: {rejectUnauthorized: false},
  logging: false,
  autoLoadEntities: true,
  synchronize: true,
}));