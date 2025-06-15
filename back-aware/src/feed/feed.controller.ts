import { Controller, Get, Query } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly svc: FeedService) {}

  @Get()
  getFeed(
    @Query('feed_type') feed_type: string,
    @Query('topics') topics?: string,
    @Query('languages') languages?: string,
    @Query('page') page = '1',
    @Query('size') size = '10',
  ) {
    return this.svc.getFeed(
      feed_type,
      topics,
      languages,
      parseInt(page, 10),
      parseInt(size, 10),
    );
  }
}
