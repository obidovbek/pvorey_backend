import { Controller, Get } from '@nestjs/common';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private scrapperService: ScrapperService) {}

  @Get()
  scrapperController() {
    return this.scrapperService.autoUpdateTeacherProfile('https://scholar.google.ru/citations?user=I8defrcAAAAJ');
  }
}
