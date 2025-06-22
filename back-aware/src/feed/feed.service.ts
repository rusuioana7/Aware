import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);
  private readonly newsBase: string;

  constructor(private readonly http: HttpService) {
    this.newsBase = (process.env.NEWS_SERVICE_URL || '').replace(/\/$/, '');
    if (!this.newsBase) {
      this.logger.error('NEWS_SERVICE_URL not set');
      throw new Error('NEWS_SERVICE_URL must be defined');
    }
  }

  async getFeed(
    feed_type: string,
    topics?: string,
    languages?: string,
    page = 1,
    size = 10,
    sort = 'published',
  ) {
    const params = new URLSearchParams({
      feed_type,
      page: String(page),
      size: String(size),
      sort,
    });
    if (topics) params.append('topics', topics);
    if (languages) params.append('languages', languages);

    const url = `${this.newsBase}/feed?${params.toString()}`;
    this.logger.log(`→ proxying GET ${url}`);

    try {
      const resp = await firstValueFrom(this.http.get(url));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return resp.data;
    } catch (err: any) {
      this.logger.error(`✖ error fetching feed: ${err.message}`);
      throw new HttpException(
        'Bad gateway: could not fetch feed',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
