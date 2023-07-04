import { Injectable } from '@nestjs/common';
import { Cron, Interval, CronExpression  } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config/dist';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class CronService{

    constructor(
        private httpService: HttpService,
        private configService: ConfigService
    ){}
    // @Interval(10000)
    @Cron('0 */6 * * *')
    handleCron() {
      this.httpService.get(this.configService.get('RECALC')).subscribe(res=>{
        console.log('res cron works', res.data);
      },err=>{
        console.log('err cron works', err.data);
      })
    }

    @Cron(CronExpression.EVERY_HOUR)
    async ifHasErrorRerun() {
      try {
        const lastUpdatedTeachIndex = JSON.parse(await fs.readFileSync(this.configService.get('FOLDERTODB')+'/lastUpdatedTeachIndex.txt', 'utf8'));
        if(!lastUpdatedTeachIndex)return;
        const currentDate = new Date(); const currentTime = currentDate.getTime(); const lastUpdatedDate = new Date(lastUpdatedTeachIndex.date); const lastUpdatedTime = lastUpdatedDate.getTime();
  
        const differenceInMinutes = (currentTime - lastUpdatedTime) / (1000 * 60);
        console.log('differenceInMinutes',lastUpdatedTeachIndex)
        if(differenceInMinutes > 30){
          await axios.get(this.configService.get('STARTUPDATINGURL')+'/'+parseInt(lastUpdatedTeachIndex.teacherIndex + 1));
        }
      } catch (error) { console.error('Error:', error);}

    }

    // async makeRequest() {
    //   try {
    //     console.log('makeRequest', this.configService.get('STARTUPDATINGURL')+'/600')
    //     const response = await axios.get(this.configService.get('STARTUPDATINGURL')+'/600');
    //     console.log(response);
    //   } catch (error) {
    //     console.error('Error:', error);
    //   }
    // }
}