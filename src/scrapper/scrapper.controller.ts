import { Controller, Get } from '@nestjs/common';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private scrapperService: ScrapperService) {}

  @Get()
  scrapperController() {
    // return this.scrapperService.getArticle('https://scholar.google.com/citations?view_op=view_citation&hl=ru&user=itSn6DMAAAAJ&citation_for_view=itSn6DMAAAAJ:W7OEmFMy1HYC');
    return this.scrapperService.autoUpdate();
    // return this.scrapperService.autoUpdateTeacherProfile('https://scholar.google.com/citations?user=rQQYUF4AAAAJ');
    // return this.scrapperService.autoUpdateTeacherProfile('https://scholar.google.com/citations?user=rQQYUF4AAAAJ');
  }
}
