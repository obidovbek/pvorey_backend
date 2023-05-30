import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config/dist';

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
        console.log('res cron works', res);
      },err=>{
        console.log('err cron works', err);
      })
    }
}