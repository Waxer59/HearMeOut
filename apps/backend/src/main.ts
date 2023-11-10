import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');
  const config = new DocumentBuilder()
    .setTitle('Hear me out API')
    .setDescription('Hear me out API')
    .addCookieAuth(
      'Authorization',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'Authorization',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });

  app.setGlobalPrefix('api');
  app.use(cookieParser(process.env.COOKIE_SECRET));

  await app.listen(process.env.PORT || 3000, () => {
    logger.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
}
bootstrap();
