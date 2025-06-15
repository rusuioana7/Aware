import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ThreadDto } from '../articles/dto/thread.dto';

@Injectable()
export class ThreadsService {
  private readonly logger = new Logger(ThreadsService.name);
  private readonly newsBase: string;

  constructor(private readonly http: HttpService) {
    this.newsBase = (process.env.NEWS_SERVICE_URL || '').replace(/\/$/, '');
    if (!this.newsBase) throw new Error('NEWS_SERVICE_URL must be set');
  }

  async findOne(id: string): Promise<ThreadDto> {
    const url = `${this.newsBase}/threads/${id}`;
    this.logger.log(`→ proxying GET ${url}`);
    try {
      const resp = await firstValueFrom(this.http.get<ThreadDto>(url));
      this.logger.log(`← got ${resp.status} for thread ${id}`);
      return resp.data;
    } catch (err: any) {
      this.logger.error(`✖️ error fetching thread ${id}: ${err.message}`);
      throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);
    }
  }
}
