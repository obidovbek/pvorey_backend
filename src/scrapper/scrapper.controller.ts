import { Controller, Get, Param, Post } from '@nestjs/common';
import { ScrapperService } from 'src/scrapper/scrapper.service';

@Controller('scrapper')
export class ScrapperController {
  constructor(private scrapperService: ScrapperService) {}

  @Get(':id')
  scrapperController(@Param('id') id: number) {
    return this.scrapperService.autoUpdate(id);
  }

  @Post('getarticles')
  getArticles() {
    console.log('getarticles')
    const url = 'https://scholar.google.ru/citations?view_op=view_citation&hl=en&oe=ASCII&user=r-E96kIAAAAJ&cstart=1&pagesize=100&citation_for_view=r-E96kIAAAAJ:JV2RwH3_ST0C'
    return this.scrapperService.getArticle(url);
  }

  @Post('getallarticles')
  rdr() {
    const url = 'https://scholar.google.com/citations?hl=ru&user=1XZdxIAAAAAJ'
    return this.scrapperService.getAllArticleUrlFromProfile(url);
  }
  
}
