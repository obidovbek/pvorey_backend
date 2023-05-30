import { Module } from '@nestjs/common';
import { ScrapperModule } from './scrapper/scrapper.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ServicesModule } from './services/services.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    HttpModule,
    ScrapperModule, 
    ServicesModule,
    ConfigModule.forRoot({
      envFilePath: `env/.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
}
