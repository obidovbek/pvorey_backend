import { Module } from '@nestjs/common';
import { ScrapperController } from './scrapper.controller';
import { ScrapperService } from './scrapper.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [ScrapperController],
  providers: [ScrapperService],
  imports: [HttpModule]
})
export class ScrapperModule {
  constructor(){}
}
