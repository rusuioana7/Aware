// src/search/search.controller.ts
import { Controller, Get, Query, Req } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request } from 'express';

interface Article {
  id: string;
  title: string;
  topic: string;
  author: string;
  description: string;
  views: number;
  commentsCount: number;
  published: string;
  image?: string;
  source: string;
}

interface Thread {
  id: string;
  title: string;
  last_updated: string;
  topic?: string;
  image?: string;
  articles: string[];
  language?: string;
}

interface FeedResponse {
  articles: Article[];
  threads: Thread[];
}

@Controller('search')
export class SearchController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  async search(
    @Query('q') query: string,
    @Query('view') view: string = 'both',
    @Query('sort') sort: string = 'published',
    @Query('page') page = '1',
    @Query('size') size = '20',
    @Req() req: Request,
  ): Promise<FeedResponse> {
    const token = req.headers.authorization;

    const response = await this.httpService.axiosRef.get<FeedResponse>(
      `${process.env.NEWS_SERVICE_URL}/search`,
      {
        headers: { Authorization: token },
        params: {
          q: query,
          view,
          sort,
          page,
          size,
        },
      },
    );

    return response.data;
  }
}
