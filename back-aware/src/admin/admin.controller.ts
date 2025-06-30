import {
  Controller,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  Post,
  Get,
  Delete,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../auth/admin.guard';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { ArticlesService } from '../articles/articles.service';
import { ThreadsService } from '../threads/threads.service';
import { FeedService } from '../feed/feed.service';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), AdminGuard)
export class AdminController {
  constructor(
    private prisma: PrismaService,
    private articlesService: ArticlesService,
    private threadsService: ThreadsService,
    private feedService: FeedService,
  ) {}

  @Post('users')
  async createUser(@Body() dto: RegisterUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    return this.prisma.user.create({
      data: { email: dto.email, password: hashed },
      select: { id: true, email: true },
    });
  }

  @Get('users')
  async listUsers() {
    return this.prisma.user.findMany({
      include: {
        threadFollows: true,
        bookmarkFolders: true,
        Comment: true,
      },
    });
  }

  @Delete('users/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    await this.prisma.user.delete({ where: { id } });
    return { message: `User ${id} deleted` };
  }

  @Get('articles')
  async getAllArticles(
    @Query('topics') topics?: string,
    @Query('languages') languages?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size = 10,
    @Query('sort', new DefaultValuePipe('published')) sort = 'published',
  ) {
    return this.feedService.getFeed(
      'articles',
      topics,
      languages,
      page,
      size,
      sort,
    );
  }

  @Delete('articles/:id')
  async deleteArticle(@Param('id') id: string) {
    return this.articlesService.delete(id);
  }

  @Get('threads')
  async getAllThreads(
    @Query('topics') topics?: string,
    @Query('languages') languages?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size = 10,
    @Query('sort', new DefaultValuePipe('published')) sort = 'published',
  ) {
    return this.feedService.getFeed(
      'threads',
      topics,
      languages,
      page,
      size,
      sort,
    );
  }

  @Delete('threads/:id')
  async deleteThread(@Param('id') id: string) {
    return this.threadsService.delete(id);
  }
}
