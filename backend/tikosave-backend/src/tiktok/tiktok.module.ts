import { Module } from '@nestjs/common';
import { TiktokController } from './tiktok.controller';
import { TiktokService } from './tiktok.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TiktokController],
  providers: [TiktokService],
})
export class TiktokModule {}