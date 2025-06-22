import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Delete,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(JwtAuthGuard)
  @Post(':articleId')
  async createComment(
    @Param('articleId') articleId: string,
    @Body() body: { text: string; isAnonymous: boolean; parentId?: string },
    @Req() req: Request & { user: { id: number } },
  ) {
    return this.commentsService.create(req.user.id, { ...body, articleId });
  }

  @Get(':articleId')
  async getComments(@Param('articleId') articleId: string) {
    return this.commentsService.getByArticle(articleId);
  }

  @Get(':articleId/count')
  async getCommentCount(@Param('articleId') articleId: string) {
    const count = await this.commentsService.countByArticle(articleId);
    return { count };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteComment(@Param('id') id: string, @Req() req: Request) {
    const userId: number = Number(req.user?.['id']);
    if (!userId || isNaN(userId)) {
      throw new UnauthorizedException('Invalid user ID');
    }

    const success = await this.commentsService.deleteComment(id, userId);
    if (!success) throw new NotFoundException('Comment not found or not yours');
    return { message: 'Deleted successfully' };
  }
}
