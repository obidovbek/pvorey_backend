import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
import { map } from 'rxjs/operators';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config/dist';

@Injectable()
export class ScrapperService {
  
  updatingUser;
  autoUpdateTeacherProfile;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService  
  ) {
  }

  async autoUpdate(){
    return await fs.readdir(this.configService.get('FOLDERTODB')+'pvoIns', async (err, files)=>{
      if(err){console.log(err); return 12;}
      this.autoUpdateTeacherProfile = await this.autoUpdateTeacherProfileWrap(files, 0);
      this.autoUpdateTeacherProfile();
      return 1;
    })
  }

  async removeOldArticles(){
    return await fs.readdir(this.configService.get('FOLDERTODB')+'fieldsInform/1d5', (err, files)=>{
      files?.map(file=>{
        if(file.indexOf('s'+this.updatingUser.added_id+'s') > -1){
          fs.unlink(this.configService.get('FOLDERTODB')+'fieldsInform/1d5/'+file, (err) => {
            if (err) throw err;
            console.log('File deleted successfully!');
          });
        }
      })
    });
  }
  autoUpdateTeacherProfileWrap = async (teacherFolders, index) => {
    return async ()=>{
      if(index==teacherFolders.length-1){ this.autoUpdate(); return "completed";}
        // if(index%100===0){this.httpService.get(this.configService.get('RECALC'));}
        try{
        this.updatingUser = JSON.parse(await fs.readFileSync(this.configService.get('FOLDERTODB')+'pvoIns/'+teacherFolders[index], 'utf8'));
        await this.removeOldArticles();
        const articleUrls = await this.getAllArticleUrlFromProfile(this.updatingUser.google_link).toPromise();
        console.log('articleUrls', articleUrls);
        if(articleUrls.length) {this.loadArticle([], articleUrls, 0, teacherFolders, index)}
        else{ this.autoUpdateTeacherProfile();}
      }catch(e){
        this.autoUpdateTeacherProfile();
      }
      return index++;
    }

  }
  async loadArticle(result:any, articleUrls:string[], i, teacherFolders, index) {
    try{
      await setTimeout(async()=>{
        const article = await this.getArticle('https://scholar.google.ru'+articleUrls[i]).toPromise();
        result.push(article);
        try{
          await fs.writeFile(this.configService.get('FOLDERTODB')+'fieldsInform/1d5/'+article[article.length - 1].added_id+'.txt', JSON.stringify(article), function (err) {
            if (err) throw err;
            console.log('File created!');
          });
        }catch(e){}
        if(i==articleUrls.length-1) this.autoUpdateTeacherProfile();
        else this.loadArticle(result, articleUrls, i+1, teacherFolders, index);
      }, this.configService.get('TIMETOUPDATE'))

    }
    catch(e){}
  }
  getAllArticleUrlFromProfile(teacherUrl:string){
    const url = teacherUrl+'&hl=en&cstart=1&pagesize=200';
    let axiosConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };
    try{
      return this.httpService.post(url, {}, axiosConfig).pipe(
        map(res=>res.data),
        map((res:any)=>{
          const dom = new JSDOM(res); let article_url = []; let counter = 1; const domwindoc = dom.window.document;
          while(domwindoc.querySelector(`#gsc_a_b > tr:nth-child(${counter}) > td.gsc_a_c`) && parseInt(domwindoc.querySelector(`#gsc_a_b > tr:nth-child(${counter}) > td.gsc_a_c`).textContent)){
            article_url.push(domwindoc.querySelector(`#gsc_a_b > tr:nth-child(${counter}) > td.gsc_a_t > a`).attributes[0].value)
            counter++;
          }
          return article_url;
        })
      )
    }catch(e){console.log(e);}
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

      try{
        const dom = new JSDOM(res); const domwindoc = dom.window.document;
        let citiations = 0;
        const avaYears = ['2019', '2020', '2021', '2022', '2023']
        for(var i=1;i<20;i++){
          try{
            const year_string_attr = await domwindoc.querySelector(`#gsc_oci_graph_bars > a:nth-child(${i})`).attributes[0].value; 
            if(this.isYearInArray(avaYears, year_string_attr)){
              citiations += parseInt(domwindoc.querySelector(`#gsc_oci_graph_bars > a:nth-child(${i}) > span`).textContent)
            }
          }
          catch(e){}
        } 
        const result = [
          {
            "title": "Muallif F.I.Sh",
            "value": this.updatingUser.lname?.replace(/\s/g,'') + ' ' + this.updatingUser.fname?.replace(/\s/g,'') + ' ' + this.updatingUser.patronymic?.replace(/\s/g,''),
            "type": "inputautocomplete"
          },
          {
            "title": "Jurnalning nomi",
            "value": domwindoc.querySelector('#gsc_oci_table > div:nth-child(3) > div.gsc_oci_value')?.textContent,
            "type": "input"
          },
          {
            "title": "Jurnalning nashr etilgan yili va oyi",
            "value": domwindoc.querySelector('#gsc_oci_table > div:nth-child(2) > div.gsc_oci_value')?.textContent,
            "type": "input"
          },
          {
            "title": "Maqolaning nomi",
            "value": domwindoc.querySelector('#gsc_oci_title > a')?.textContent,
            "type": "input"
          },
          {
            "title": "Maqolaning qaysi tilda chop etilganligi",
            "value": "O'zbek",
            "type": "input"
          },
          {
            "title": "Chop etilgan materiallarning «Google Scholar» va boshqa xalqaro e'tirof etilgan qidiruv tizimlardagi internet manzili (giper xavolasi)",
            "value": url,
            "type": "input",
            "addition": "link"
          },
          {
            "title": "iqtiboslar soni",
            "value": citiations,
            "type": "number"
          },
          {
            "created": "08-09-2022 15:07",
            "indexId": "1d5",
            "user": "",
            "status": "complete",
            "comment": "",
            "pvoNames": this.updatingUser.lname?.replace(/\s/g,'') + ' ' + this.updatingUser.fname?.replace(/\s/g,'') + ' ' + this.updatingUser.patronymic?.replace(/\s/g,''),
            "added_id": "s"+this.updatingUser.added_id+"s_"+Math.floor(100000000 + Math.random() * 900000000),
            "grade": Math.floor(1/((domwindoc.querySelector('#gsc_oci_table > div:nth-child(1) > div.gsc_oci_value')?.textContent.split(",").length)) * 100) / 100,
          }
        ]
        console.log('result', result)
        return result;
      }catch(e){
        console.log(e)
      }  
        return ;
      })
    )
  }

  isYearInArray(avaYears, link) {
    for(const year of avaYears){
      if(link.indexOf('as_yhi='+year) > -1){
        return true;
      }
    }
    return false;
  }
}
