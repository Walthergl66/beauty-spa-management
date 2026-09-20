import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    return {
      type: 'postgres',
      host: configService.get<string>('DB_HOST', 'localhost'),
      port: Number(configService.get<number>('DB_PORT', 5432)),
      username: configService.get<string>('DB_USERNAME', 'spa_admin'),
      password: configService.get<string>('DB_PASSWORD', 'spa_secret'),
      database: configService.get<string>('DB_DATABASE', 'spa_db'),
      autoLoadEntities: true,
      synchronize: configService.get<string>('DB_SYNCHRONIZE', 'true') === 'true',
      logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
      extra: {
        max: 20,
      },
    };
  },
};
