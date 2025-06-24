import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderDto } from './dto/create-folder';
import { HttpService } from '@nestjs/axios';
import { Prisma } from '@prisma/client';
import { ArticleDto } from '../articles/dto/article.dto';
import { ThreadDto } from '../articles/dto/thread.dto';

export type FolderNode = {
  id: string;
  name: string;
  color?: string | null;
  starred: boolean;
  parentId?: string | null;
  articleIds: string[];
  threadIds: string[];
  createdAt: Date;
  updatedAt: Date;
  children: FolderNode[];
};

@Injectable()
export class BookmarksService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async createFolder(userId: number, dto: CreateFolderDto) {
    const data: Prisma.BookmarkFolderCreateInput = {
      name: dto.name,
      color: dto.color,
      starred: dto.starred ?? false,
      articleIds: [],
      threadIds: [],
      user: { connect: { id: userId } },
      ...(dto.parentId ? { parent: { connect: { id: dto.parentId } } } : {}),
    };

    return this.prisma.bookmarkFolder.create({ data });
  }

  async addArticleToFolder(
    userId: number,
    folderId: string,
    articleId: string,
  ) {
    const folder = await this.prisma.bookmarkFolder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');

    return this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: {
        articleIds: {
          set: Array.from(new Set([...folder.articleIds, articleId])),
        },
      },
    });
  }
  async addThreadToFolder(userId: number, folderId: string, threadId: string) {
    const folder = await this.prisma.bookmarkFolder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');

    return this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: {
        threadIds: {
          set: Array.from(new Set([...(folder.threadIds || []), threadId])),
        },
      },
    });
  }
  async getThreadsFromFolder(folder: {
    threadIds: string[];
  }): Promise<ThreadDto[]> {
    const threads = await Promise.all(
      folder.threadIds.map(async (id): Promise<ThreadDto | null> => {
        try {
          const res = await this.http.axiosRef.get<ThreadDto>(
            `${process.env.NEWS_SERVICE_URL}/threads/${id}`,
          );
          return res.data;
        } catch {
          return null;
        }
      }),
    );
    return threads.filter((t): t is ThreadDto => t !== null);
  }

  async removeFolder(userId: number, folderId: string) {
    const folder = await this.prisma.bookmarkFolder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');

    return this.prisma.bookmarkFolder.delete({ where: { id: folderId } });
  }

  async toggleStar(userId: number, folderId: string) {
    const folder = await this.prisma.bookmarkFolder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');

    return this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: { starred: !folder.starred },
    });
  }

  async getFolderById(userId: number, folderId: string) {
    const folder = await this.prisma.bookmarkFolder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');
    return folder;
  }

  async getArticlesFromFolder(folder: {
    articleIds: string[];
  }): Promise<ArticleDto[]> {
    const articles = await Promise.all(
      folder.articleIds.map(async (id) => {
        try {
          const res = await this.http.axiosRef.get<ArticleDto>(
            `${process.env.NEWS_SERVICE_URL}/articles/${id}`,
          );
          return res.data;
        } catch {
          return null;
        }
      }),
    );
    return articles.filter((a): a is ArticleDto => a !== null);
  }

  async getAllArticlesInFolder(folder: {
    articleIds: string[];
    threadIds: string[];
  }): Promise<ArticleDto[]> {
    const threads = await this.getThreadsFromFolder(folder);

    const threadArticleIds = threads.flatMap((t) => t.articles);
    const uniqueIds = Array.from(
      new Set([...folder.articleIds, ...threadArticleIds]),
    );

    const all = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const res = await this.http.axiosRef.get<ArticleDto>(
            `${process.env.NEWS_SERVICE_URL}/articles/${id}`,
          );
          return res.data;
        } catch {
          return null;
        }
      }),
    );

    return all.filter((a): a is ArticleDto => a !== null);
  }

  async getFolderTree(userId: number): Promise<FolderNode[]> {
    const allFolders = await this.prisma.bookmarkFolder.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    const map = new Map<string, FolderNode>();
    allFolders.forEach((f) => map.set(f.id, { ...f, children: [] }));

    const roots: FolderNode[] = [];
    allFolders.forEach((f) => {
      const node = map.get(f.id)!;
      if (f.parentId) {
        const parent = map.get(f.parentId);
        if (parent) parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
  async getSaveForLaterFolder(userId: number) {
    return this.prisma.bookmarkFolder.findFirst({
      where: {
        userId,
        name: { equals: 'Save for Later', mode: 'insensitive' },
      },
    });
  }
  async removeArticleFromFolder(
    userId: number,
    folderId: string,
    articleId: string,
  ) {
    const folder = await this.prisma.bookmarkFolder.findFirst({
      where: { id: folderId, userId },
    });
    if (!folder) throw new NotFoundException('Folder not found');

    return this.prisma.bookmarkFolder.update({
      where: { id: folderId },
      data: {
        articleIds: {
          set: folder.articleIds.filter((id) => id !== articleId),
        },
      },
    });
  }
}
