import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Liquid } from 'liquidjs';
import * as path from 'node:path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const engine = new Liquid({
    layouts: path.join(process.cwd(), 'views', 'layouts'),
  });

  engine.registerFilter('BRL', (value) =>
    parseFloat(value).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }),
  );
  app.engine('liquid', engine.express());
  app.useStaticAssets(path.join(process.cwd(), 'public'));
  app.setBaseViewsDir(path.join(process.cwd(), 'views'));
  app.setViewEngine('liquid');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}
bootstrap();
