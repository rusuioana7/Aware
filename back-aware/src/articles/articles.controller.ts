import { Controller, Get, Logger, Param, Res, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Response } from 'express';

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
  @Get()
  async getAllArticles() {
    this.logger.log(`🔍 GET /articles`);
    const result = await this.svc.findAll();
    this.logger.log(`✅ Responding with all articles`);
    return result;
  }
  @Get(':id/download/:type')
  @UseGuards(JwtAuthGuard)
  async downloadArticle(
    @Param('id') id: string,
    @Param('type') type: 'pdf' | 'txt' | 'md',
    @Res() res: Response,
  ) {
    const file = await this.svc.generateArticleFile(id, type); // ✅ FIX: `this.svc`

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.filename}"`,
    });

    return res.send(file.buffer); // ✅ Must be a real Buffer
  }
  @Get(':id/audio')
  @UseGuards(JwtAuthGuard)
  async streamAudio(@Param('id') id: string, @Res() res: Response) {
    try {
      const audioBuffer = await this.svc.generateAudio(id);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${id}.mp3"`,
        'Content-Length': audioBuffer.length,
      });

      res.send(audioBuffer);
    } catch (error: any) {
      this.logger.error(`Failed to generate audio: ${error.message}`);
      res.status(500).send('Failed to generate audio');
    }
  }
}
