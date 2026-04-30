import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import * as compression from 'compression';
import * as helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Security Middleware
  app.use(helmet());
  app.use(compression());

  // CORS Configuration
  const corsOrigins = configService
    .get<string>('CORS_ORIGIN')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Global Exception Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle(configService.get<string>('APP_NAME'))
    .setDescription('Multi-tenant Jewelry Trading Platform API')
    .setVersion(configService.get<string>('APP_VERSION'))
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addServer(
      configService.get<string>('APP_URL') || 'http://localhost:3000',
      'Development',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get<number>('APP_PORT') || 3000;
  const env = configService.get<string>('NODE_ENV') || 'development';

  await app.listen(port, () => {
    console.log(`\n`);
    console.log(`╔═══════════════════════════════════════════════════════╗`);
    console.log(`║     🚀 Jewelry Trading Platform Backend 🚀           ║`);
    console.log(`║                                                       ║`);
    console.log(`║  🌍 Environment: ${env.padEnd(39)}║`);
    console.log(`║  📍 Server: http://localhost:${port}             ║`);
    console.log(`║  📚 API Docs: http://localhost:${port}/api/docs     ║`);
    console.log(`║                                                       ║`);
    console.log(`╚═══════════════════════════════════════════════════════╝`);
    console.log(`\n`);
  });
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});