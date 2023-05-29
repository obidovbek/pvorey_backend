import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Module({
  imports: [
    ScrapperModule, 
    ConfigModule.forRoot({
      envFilePath: `env/.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // static port: number | string;

  constructor(private readonly configService: ConfigService) {
    // AppModule.port = this.configService.get('PORT');
    console.log('AppModule', this.configService.get('PORT'));
  }
}
