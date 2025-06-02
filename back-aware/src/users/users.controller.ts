import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticatedRequest } from '../types/express';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const user = await this.usersService.findById(userId);
    return {
      email: user?.email || '',
      createdAt: user?.createdAt.toISOString() || '',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  @HttpCode(200)
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() data: UpdateProfileDto,
  ): Promise<User> {
    const userId = req.user.id;
    return this.usersService.updateProfile(userId, data);
  }
}
