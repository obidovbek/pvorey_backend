import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
import { map } from 'rxjs/operators';

@Injectable()
export class ScrapperService {
  
  constructor(private httpService: HttpService) {}

  async autoUpdateTeacherProfile(teacherUrl:string) {
    let result = [];
    const articleUrls = await this.getAllArticleUrlFromProfile(teacherUrl).toPromise();
    console.log('articleUrls', articleUrls);

    for(var i=0;i<articleUrls.length;i++){
        try{
          await setTimeout(()=>{}, 15000)
          const article = await this.getArticle('https://scholar.google.ru'+articleUrls[i]).toPromise();
          result.push(article);
          if(i==articleUrls.length-1) return result;
        }
        catch(e){}
    }
  }

  getAllArticleUrlFromProfile(teacherUrl:string){
    const url = teacherUrl+'&hl=en&cstart=1&pagesize=200';
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };
    return this.httpService.post(url, {}, axiosConfig).pipe(
      map(res=>res.data),
      map((res:any)=>{
        const dom = new JSDOM(res); let article_url = []; let counter = 1; const domwindoc = dom.window.document;
        while(parseInt(domwindoc.querySelector(`#gsc_a_b > tr:nth-child(${counter}) > td.gsc_a_c`).textContent)){
          article_url.push(domwindoc.querySelector(`#gsc_a_b > tr:nth-child(${counter}) > td.gsc_a_t > a`).attributes[0].value)
          counter++;
        }
        return article_url;
      })
    )
  }
  getArticle(url:string) {
    // const url = 'https://scholar.google.ru/citations?view_op=view_citation&hl=en&user=I8defrcAAAAJ&cstart=1&citation_for_view=I8defrcAAAAJ:0N-VGjzr574C';
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };
    return this.httpService.post(url, {}, axiosConfig).pipe(
      map(res=>res.data),
      map(async (res:any)=>{
        const dom = new JSDOM(res); const domwindoc = dom.window.document;
        const result = await {
          article_name: domwindoc.querySelector('#gsc_oci_title > a').textContent,
          journal_name: domwindoc.querySelector('#gsc_oci_table > div:nth-child(3) > div.gsc_oci_value').textContent,
          publishing_date: domwindoc.querySelector('#gsc_oci_table > div:nth-child(2) > div.gsc_oci_value').textContent,
          citiations: 0
        }
        const avaYears = ['2019', '2020', '2021', '2022', '2023']
        for(var i=1;i<20;i++){
          try{
            const year_string_attr = await domwindoc.querySelector(`#gsc_oci_graph_bars > a:nth-child(${i})`).attributes[0].value; 
            if(this.isYearInArray(avaYears, year_string_attr)){
              result.citiations += parseInt(domwindoc.querySelector(`#gsc_oci_graph_bars > a:nth-child(${i}) > span`).textContent)
            }
          }
          catch(e){}
        }
        return result;
      })
    )
  }
  // async articleScapper(url:string) {
  //   const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto(url);
  //   const result = await {
  //     article_name: await page.$eval('#gsc_oci_title > a', el => el.textContent),
  //     journal_name: await page.$eval('#gsc_oci_table > div:nth-child(3) > div.gsc_oci_value', el => el.textContent),
  //     publishing_date: await page.$eval('#gsc_oci_table > div:nth-child(2) > div.gsc_oci_value', el => el.textContent),
  //     citiations: 0
  //   }
  //   const avaYears = ['2019', '2020', '2021', '2022', '2023']
  //   for(var i=1;i<20;i++){
  //     try{
  //       const year_string_attr = await page.$eval('#gsc_oci_graph_bars > a:nth-child('+i+')', el => el.attributes[0].value); 
  //       if(this.isYearInArray(avaYears, year_string_attr)){
  //         console.log('year_string_attr: ' + year_string_attr);
  //         result.citiations += parseInt(await page.$eval('#gsc_oci_graph_bars > a:nth-child('+i+') > span', el => el.textContent));
  //       }
  //     }
  //     catch(e){}
  //   }
  //   await browser.close();
  //   return result;
  // }

  isYearInArray(avaYears, link) {
    for(const year of avaYears){
      if(link.indexOf('as_yhi='+year) > -1){
        return true;
      }
    }
    return false;
  }
}
