import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UserProfile, UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticatedRequest } from '../types/express';

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
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
