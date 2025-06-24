import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  HttpCode,
  Post,
  Param,
  Delete,
} from '@nestjs/common';
import { UserProfile, UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticatedRequest } from '../types/express';
import { HttpService } from '@nestjs/axios';
import { ArticleDto } from '../articles/dto/article.dto';

interface FullProfileResponse {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  language: string[];
  country: string[];
  favoriteTopics: string[];
  createdAt: string;
  profilePhoto?: string | null;
  bannerPhoto?: string | null;
  isPublic: boolean;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly httpService: HttpService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest): Promise<FullProfileResponse> {
    const userId = req.user.id;
    const user: UserProfile = await this.usersService.findById(userId);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      language: user.language,
      country: user.country,
      favoriteTopics: user.favoriteTopics || [],
      createdAt: user.createdAt.toISOString(),
      profilePhoto: user.profilePhoto ?? null,
      bannerPhoto: user.bannerPhoto ?? null,
      isPublic: user.isPublic ?? true,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @HttpCode(200)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileDto,
  ): Promise<UserProfile> {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, data);
  }

  @UseGuards(JwtAuthGuard)
  @Post('viewed/:id')
  async trackViewed(
    @Req() req: AuthenticatedRequest,
    @Param('id') articleId: string,
  ) {
    await this.usersService.trackViewedArticle(req.user.id, articleId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('recent-articles')
  async getRecentArticles(@Req() req: AuthenticatedRequest) {
    const articleIds = await this.usersService.getRecentArticleIds(req.user.id);

    const articles = await Promise.all(
      articleIds.map(async (id) => {
        try {
          const { data } = await this.httpService.axiosRef.get<ArticleDto>(
            `${process.env.NEWS_SERVICE_URL}/articles/${id}`,
          );
          return data;
        } catch {
          return null;
        }
      }),
    );

    return articles.filter((a): a is ArticleDto => a !== null);
  }

  @UseGuards(JwtAuthGuard)
  @Post('threads/:id/follow')
  async followThread(
    @Req() req: AuthenticatedRequest,
    @Param('id') threadId: string,
  ) {
    await this.usersService.followThread(req.user.id, threadId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('threads/:id/unfollow')
  async unfollowThread(
    @Req() req: AuthenticatedRequest,
    @Param('id') threadId: string,
  ) {
    await this.usersService.unfollowThread(req.user.id, threadId);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('threads-followed')
  async getFollowedThreads(@Req() req: AuthenticatedRequest) {
    return this.usersService.getFollowedThreads(req.user.id);
  }
}
