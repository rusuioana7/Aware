import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ArticleDto } from './dto/article.dto';
import { ThreadDto } from './dto/thread.dto';
import { CommentsService } from '../comments/comments.service';
import PDFDocument from 'pdfkit';
import { Buffer } from 'buffer';
import * as textToSpeech from '@google-cloud/text-to-speech';

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
  async findAll(): Promise<ArticleDto[]> {
    const url = `${this.newsBase}/articles`;
    this.logger.log(`→ proxying GET ${url}`);
    try {
      const resp = await firstValueFrom(
        this.httpService.get<ArticleDto[]>(url),
      );
      this.logger.log(`← got ${resp.status} articles`);
      return resp.data;
    } catch (err: any) {
      this.logger.error(`✖️ upstream error: ${err.message}`);
      throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);
    }
  }
  async delete(id: string): Promise<void> {
    const url = `${this.newsBase}/articles/${id}`;
    this.logger.log(`→ proxying DELETE ${url}`);
    try {
      const resp = await firstValueFrom(this.httpService.delete<void>(url));
      this.logger.log(`← got ${resp.status} for DELETE article ${id}`);
    } catch (err: any) {
      this.logger.error(`✖️ error deleting article ${id}: ${err.message}`);
      throw new HttpException('Bad gateway', HttpStatus.BAD_GATEWAY);
    }
  }
  async generateArticleFile(id: string, type: 'pdf' | 'txt' | 'md') {
    const article = await this.findOne(id);
    const content = `${article.title}\n\nBy ${article.author} | ${article.source}\nPublished: ${article.published}\n\n${article.content}`;

    if (type === 'pdf') {
      const doc = new PDFDocument();
      const chunks: Uint8Array[] = [];

      doc.on('data', (chunk: Uint8Array) => chunks.push(chunk));

      doc.fontSize(18).text(article.title, { underline: true });
      doc.moveDown();
      doc.fontSize(12).text(`By ${article.author} | ${article.source}`);
      doc.text(`Published: ${article.published}`);
      doc.moveDown();

      if (article.image) {
        try {
          const imgRes = await this.httpService.axiosRef.get<ArrayBuffer>(
            article.image,
            {
              responseType: 'arraybuffer',
            },
          );
          const imageBuffer = Buffer.from(imgRes.data);

          const pageWidth =
            doc.page.width - doc.page.margins.left - doc.page.margins.right;
          const imageMaxWidth = 400;
          const imageX =
            doc.page.margins.left + (pageWidth - imageMaxWidth) / 2;
          const imageHeight = 250;

          doc.image(imageBuffer, imageX, doc.y, {
            fit: [imageMaxWidth, imageHeight],
          });

          doc.moveDown();
          doc.y += imageHeight + 10;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Unknown error';
          this.logger.warn(`⚠️ Could not fetch or embed image: ${msg}`);
        }
      }

      doc.fontSize(12).text(article.content, { align: 'left' });
      doc.end();

      const buffer = await new Promise<Buffer>((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);
      });

      return {
        mimeType: 'application/pdf',
        filename: `${article.title.replace(/\s+/g, '_')}.pdf`,
        buffer,
      };
    }

    return {
      mimeType: 'text/plain',
      filename: `${article.title.replace(/\s+/g, '_')}.${type}`,
      buffer: Buffer.from(content, 'utf-8'),
    };
  }
  async generateAudio(articleId: string): Promise<Buffer> {
    const article = await this.findOne(articleId);

    const client = new textToSpeech.TextToSpeechClient();

    const languageMap: Record<string, string> = {
      en: 'en-US',
      fr: 'fr-FR',
      de: 'de-DE',
      ro: 'ro-RO',
      es: 'es-ES',
    };

    const languageCode = languageMap[article.language] || 'en-US';

    const text = `${article.title}. By ${article.author}. ${article.content}`;

    const request: textToSpeech.protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest =
      {
        input: { text },
        voice: {
          languageCode,
          ssmlGender:
            textToSpeech.protos.google.cloud.texttospeech.v1.SsmlVoiceGender
              .NEUTRAL,
        },
        audioConfig: {
          audioEncoding:
            textToSpeech.protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
          speakingRate: 1.0,
        },
      };

    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      throw new Error('Failed to generate audio');
    }

    return Buffer.from(response.audioContent);
  }
}
