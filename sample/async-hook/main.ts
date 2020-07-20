/**
 * Created by Rain on 2020/7/17
 */
import { NestFactory } from '@nestjs/core';

import * as httpContext from 'express-http-context';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(httpContext.middleware);
  await app.listen(3000);
}

bootstrap();
