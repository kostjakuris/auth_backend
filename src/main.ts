import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [process.env.FRONTEND_URL!],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      allowedHeaders: "Content-Type, Accept, Authorization, X-Requested-With, initial-data",
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.set('trust proxy', 1);
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

start();
