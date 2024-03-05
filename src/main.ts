import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { getBodyParserOptions } from '@nestjs/platform-express/adapters/utils/get-body-parser-options.util';
import { json, urlencoded } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './auth.gaurd';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new AuthGuard());
  app.use(json(getBodyParserOptions(true, { limit: '50mb' })));
  app.use(urlencoded(getBodyParserOptions(true, { limit: '50mb' })));
  await app.listen(8080);
}
bootstrap();
