import { Controller, Get, Param } from '@nestjs/common';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private scrapperService: ScrapperService) {}

  @Get(':id')
  scrapperController(@Param('id') id: number) {
    return this.scrapperService.autoUpdate(id);
  }

  @Get('getarticles')
  getArticles() {
    const url = 'https://scholar.google.ru/citations?view_op=view_citation&hl=en&user=Dz3oo60AAAAJ&citation_for_view=Dz3oo60AAAAJ:O3NaXMp0MMsC'
    return this.scrapperService.getArticle(url);
  }
}
