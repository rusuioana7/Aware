import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ArticlesService } from './articles.service';

@Controller('articles')
export class ArticlesController {
  private readonly logger = new Logger(ArticlesController.name);

  constructor(private readonly svc: ArticlesService) {}

  @Get(':id')
  async getArticle(@Param('id') id: string) {
    this.logger.log(`🔍 GET /articles/${id}`);
    const result = await this.svc.findOne(id);
    this.logger.log(`✅ Responding with article ${id}`);
    return result;
  }
}
