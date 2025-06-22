import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ArticleDto } from './dto/article.dto';
import { ThreadDto } from './dto/thread.dto';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);
  private readonly newsBase: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly commentsService: CommentsService,
  ) {
    this.newsBase = (process.env.NEWS_SERVICE_URL || '').replace(/\/$/, '');
    if (!this.newsBase) {
      this.logger.error('NEWS_SERVICE_URL is not defined');
      throw new Error('NEWS_SERVICE_URL must be set');
    }
  }

  async findOne(
    id: string,
  ): Promise<ArticleDto & { thread?: ThreadDto; commentsCount: number }> {
    const url = `${this.newsBase}/articles/${id}`;
    this.logger.log(`→ proxying GET ${url}`);
    let resp: AxiosResponse<ArticleDto & { thread?: ThreadDto }>;
    try {
      resp = await firstValueFrom(this.httpService.get(url));
    } catch (err: any) {
      this.logger.error(`✖️ upstream error: ${err.message}`);
      throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);
    }
    const commentsCount = await this.commentsService.countByArticle(id);
    this.logger.log(
      `← got ${resp.status}, injecting commentsCount: ${commentsCount}`,
    );
    return {
      ...resp.data,
      commentsCount,
    };
  }
}
