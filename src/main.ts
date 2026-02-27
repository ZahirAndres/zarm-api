import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // pipe para realizar la validación de forma global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))

  // configuracion swagger
  const config = new DocumentBuilder()
  .setTitle('API con vulnerabilidades de seguridad')
  .setDescription('Documentación de la API de pruebas')
  .setVersion('1.0.0')
  .addServer("http://127.0.0.1:3000","Servidor de pruebas")
  .addServer("https://dominio.com","Servidor de producción")
  .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

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