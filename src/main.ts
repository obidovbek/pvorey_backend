import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

async function bootstrap() {
  console.log('bootstrap', process.env.PORT);
  const PORT = process.env.PORT || 3001;
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
bootstrap();
