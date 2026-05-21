import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getDatabaseConfig = (
    configService: ConfigService,
): TypeOrmModuleOptions => ({
    type: 'mssql',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 1433),
    username: configService.get<string>('DB_USERNAME', 'sa'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE', 'JewelryTradingPlatform'),
    entities: [__dirname + '/../database/entities/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/**/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: false,
    logging: configService.get<string>('NODE_ENV') === 'development',
    requestTimeout: 30000,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
});

export const databaseConfig = {
    host: 'localhost',
    port: 5432,
    username: 'your_username',
    password: 'your_password',
    database: 'your_database_name'
};