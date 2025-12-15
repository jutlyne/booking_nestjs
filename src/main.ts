import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllConfigType } from './configs/config.interface';
import validationOptions from './utils/validate-option';
import { AppLogger } from './utils/logger';
import { Environment } from './configs/app.config';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService<AllConfigType>);

  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    { exclude: ['/'] },
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.enableCors({
    origin: configService.getOrThrow('app.frontendUrl', { infer: true }),
    credentials: true,
  });

  const PORT = configService.getOrThrow('app.port', { infer: true });

  const config = new DocumentBuilder()
    .setTitle('Booking API')
    .setDescription('The booking API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('booking')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory);

  const appLogger = app.get(AppLogger);
  const appEnv = configService.getOrThrow('app.nodeEnv', { infer: true });

  try {
    await app.listen(PORT, async () => {
      appLogger.log(`Running on Port ${PORT}`);
      appLogger.log(
        `Running in ${configService.getOrThrow('app.nodeEnv', {
          infer: true,
        })} `,
      );
    });
  } catch (err) {
    appLogger.log(err);

    if (appEnv == Environment.Test) {
      process.exit(1);
    }
  }
}

bootstrap();
