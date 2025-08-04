import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('users')
    .addBearerAuth()
    .build();

    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  )

  const host = '0.0.0.0';

  await app.listen(process.env.PORT ?? 3000, host);
}
bootstrap();
