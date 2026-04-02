import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exceptions.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // V-15: Headers de seguridad HTTP
  app.use(helmet());

  // Habilitar CORS con orígenes específicos
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // pipe para realizar la validación de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))

  // Uso de filtros
  app.useGlobalFilters(new AllExceptionFilter);

  // V-16: Swagger solo disponible en desarrollo
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('ZARM API')
      .setDescription('Documentación de la API')
      .setVersion('1.0.0')
      .addBearerAuth()
      .addServer("http://127.0.0.1:3000", "Servidor de pruebas")
      .build()

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

//? POSTGRES
//! npm i pg
//! npm i @types/pg

//? MYSQL
//! npm i mysql2
//! npm i @types/mysql

//! npm i @nestjs/swagger