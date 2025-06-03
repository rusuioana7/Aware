import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  HttpCode,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateEmailDto } from './dto/update-email.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { UnlinkOauthDto } from './dto/unlink-oauth.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly usersService: UsersService) {}

  @Get('export')
  async exportData(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.usersService.exportUserData(userId);
  }

  @Put('email')
  @HttpCode(200)
  async updateEmail(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateEmailDto,
  ) {
    console.log('>>> in updateEmail, req.user =', req.user);
    const userId = req.user.id;
    if (typeof userId !== 'number') {
      throw new BadRequestException('Invalid userId');
    }
    return this.usersService.updateEmail(userId, dto);
  }

  @Put('password')
  @HttpCode(200)
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePasswordDto,
  ) {
    const userId = req.user.id;
    return this.usersService.updatePassword(userId, dto);
  }

  @Put('notifications')
  @HttpCode(200)
  async updateNotifications(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateNotificationsDto,
  ) {
    const userId = req.user.id;
    return this.usersService.updateNotifications(userId, dto);
  }

  @Put('visibility')
  @HttpCode(200)
  async updateVisibility(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateVisibilityDto,
  ) {
    const userId = req.user.id;
    return this.usersService.updateVisibility(userId, dto);
  }

  @Delete('unlink')
  @HttpCode(200)
  async unlinkOauth(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UnlinkOauthDto,
  ) {
    const userId = req.user.id;
    return this.usersService.unlinkOauth(userId, dto);
  }

  @Post('logout')
  @HttpCode(200)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }

  @Delete('account')
  @HttpCode(200)
  async deleteAccount(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    try {
      await this.usersService.prisma.user.delete({ where: { id: userId } });
      return { message: 'Account deleted successfully' };
    } catch {
      throw new NotFoundException('User not found');
    }
  }
}
