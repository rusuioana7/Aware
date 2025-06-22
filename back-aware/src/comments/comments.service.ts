import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async create(
    userId: number,
    dto: {
      text: string;
      articleId: string;
      isAnonymous: boolean;
      parentId?: string;
    },
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        text: dto.text,
        articleId: dto.articleId,
        isAnonymous: dto.isAnonymous,
        parentId: dto.parentId ?? null,
        userId,
      },
      include: { user: true },
    });

    // Step 1: Count total comments for this article
    const total = await this.countByArticle(dto.articleId);

    // Step 2: Send PATCH to Python News Service
    const url = `${process.env.NEWS_SERVICE_URL}/articles/${dto.articleId}/comments-count`;
    await firstValueFrom(this.httpService.patch(url, { count: total }));

    return comment;
  }

  async getByArticle(articleId: string) {
    return this.prisma.comment.findMany({
      where: { articleId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async countByArticle(articleId: string) {
    return this.prisma.comment.count({ where: { articleId } });
  }

  async deleteComment(commentId: string, userId: number): Promise<boolean> {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment || comment.userId !== userId) return false;

    await this.prisma.comment.delete({ where: { id: commentId } });
    return true;
  }
}
