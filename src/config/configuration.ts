import { ConfigModule } from '@nestjs/config';

export const Configuration = ConfigModule.forRoot({
  isGlobal: true, // make the configuration module global
});