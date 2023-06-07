import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  dotenv.config();

  const logger = new Logger();
  const port = parseInt(process.env.PORT, 10) || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  logger.log(`The Moody API Application is listening on port: ${port}`);
}

bootstrap();
