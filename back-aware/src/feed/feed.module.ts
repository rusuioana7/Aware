import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';

@Module({
  imports: [HttpModule],
  providers: [FeedService],
  controllers: [FeedController],
  exports: [FeedService],
})
export class FeedModule {}
