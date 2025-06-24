import {
  Controller,
  Post,
  Get,
  Delete,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { CreateFolderDto } from './dto/create-folder';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../types/express';

@Controller('bookmarks')
@UseGuards(JwtAuthGuard)
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@Req() req: AuthenticatedRequest, @Body() dto: CreateFolderDto) {
    return this.bookmarksService.createFolder(req.user.id, dto);
  }

  @Post(':folderId/articles/:articleId')
  addArticle(
    @Req() req: AuthenticatedRequest,
    @Param('folderId') folderId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.bookmarksService.addArticleToFolder(
      req.user.id,
      folderId,
      articleId,
    );
  }
  @Patch(':folderId/threads/:threadId')
  addThread(
    @Req() req: AuthenticatedRequest,
    @Param('folderId') folderId: string,
    @Param('threadId') threadId: string,
  ) {
    return this.bookmarksService.addThreadToFolder(
      req.user.id,
      folderId,
      threadId,
    );
  }

  @Get('save-for-later')
  async getSaveForLater(@Req() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    if (!userId) throw new NotFoundException('User not found');

    const folder = await this.bookmarksService.getSaveForLaterFolder(userId);
    if (!folder) throw new NotFoundException('Save for Later folder not found');

    const [articles, threads] = await Promise.all([
      this.bookmarksService.getAllArticlesInFolder(folder),
      this.bookmarksService.getThreadsFromFolder(folder),
    ]);

    return { articles, threads };
  }

  @Get(':folderId')
  async getFolder(
    @Req() req: AuthenticatedRequest,
    @Param('folderId') folderId: string,
  ) {
    const folder = await this.bookmarksService.getFolderById(
      req.user.id,
      folderId,
    );
    const articles = await this.bookmarksService.getAllArticlesInFolder(folder);
    const threads = await this.bookmarksService.getThreadsFromFolder(folder);
    return { ...folder, articles, threads };
  }

  @Delete(':folderId')
  remove(
    @Req() req: AuthenticatedRequest,
    @Param('folderId') folderId: string,
  ) {
    return this.bookmarksService.removeFolder(req.user.id, folderId);
  }
  @Delete(':folderId/articles/:articleId')
  removeArticle(
    @Req() req: AuthenticatedRequest,
    @Param('folderId') folderId: string,
    @Param('articleId') articleId: string,
  ) {
    return this.bookmarksService.removeArticleFromFolder(
      req.user.id,
      folderId,
      articleId,
    );
  }

  @Patch(':folderId/toggle-star')
  toggleStar(
    @Req() req: AuthenticatedRequest,
    @Param('folderId') folderId: string,
  ) {
    return this.bookmarksService.toggleStar(req.user.id, folderId);
  }

  @Get()
  async getTree(@Req() req: AuthenticatedRequest) {
    return this.bookmarksService.getFolderTree(req.user.id);
  }
}
