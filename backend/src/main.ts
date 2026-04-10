import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import helmet from 'helmet';
import basicAuth from 'express-basic-auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  // Habilitar CORS con orígenes específicos
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:4200', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // Pipe para realizar la validación de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  if (process.env.NODE_ENV !== 'production') {
    
    app.use(
      ['/api/docs', '/api/docs-json'], 
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER || 'admin']: process.env.SWAGGER_PASSWORD || '1234',
        },
      }),
    );
    
    const config = new DocumentBuilder()
      .setTitle('ZARM API')
      .setDescription('Documentación de la API')
      .setVersion('1.0.0')
      .addServer("http://127.0.0.1:3000", "Servidor de pruebas")
      .addBearerAuth() 
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();