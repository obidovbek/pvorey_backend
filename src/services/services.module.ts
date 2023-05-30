import { Module } from "@nestjs/common";
import { CronService } from './cron.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    providers: [CronService],
})
export class ServicesModule {}