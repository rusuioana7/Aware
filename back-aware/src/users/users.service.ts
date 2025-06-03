import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { User } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UpdateVisibilityDto } from './dto/update-visibility.dto';
import { UnlinkOauthDto } from './dto/unlink-oauth.dto';
import { hash } from 'bcrypt';

export type UserProfile = {
  id: number;
  email: string;
  name: string | null;
  bio: string | null;
  language: string | null;
  country: string | null;
  favoriteTopics: string[];
  createdAt: Date;
  profilePhoto: string | null;
  bannerPhoto: string | null;
};

@Injectable()
export class UsersService {
  constructor(readonly prisma: PrismaService) {}

  async findById(userId: number): Promise<UserProfile> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        language: true,
        country: true,
        favoriteTopics: true,
        createdAt: true,
        profilePhoto: true,
        bannerPhoto: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user;
  }

  async updateProfile(
    userId: number,
    data: UpdateProfileDto,
  ): Promise<UserProfile> {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        bio: data.bio,
        language: data.language,
        country: data.country,
        favoriteTopics: data.favoriteTopics,
        profilePhoto: data.profilePhoto,
        bannerPhoto: data.bannerPhoto,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        language: true,
        country: true,
        favoriteTopics: true,
        createdAt: true,
        profilePhoto: true,
        bannerPhoto: true,
      },
    });
  }

  async updateEmail(
    userId: number,
    dto: UpdateEmailDto,
  ): Promise<Pick<User, 'id' | 'email'>> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.newEmail },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { email: dto.newEmail },
      select: { id: true, email: true },
    });
  }

  async updatePassword(
    userId: number,
    dto: UpdatePasswordDto,
  ): Promise<{ id: number }> {
    const hashedPassword = await hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { id: userId };
  }

  async updateNotifications(
    userId: number,
    dto: UpdateNotificationsDto,
  ): Promise<
    Pick<
      User,
      | 'id'
      | 'notifyWeeklyEmail'
      | 'notifyDailyEmail'
      | 'notifyTopicAlertsEmail'
      | 'notifyWeeklyPush'
      | 'notifyDailyPush'
      | 'notifyTopicAlertsPush'
    >
  > {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        notifyWeeklyEmail: dto.notifyWeeklyEmail,
        notifyDailyEmail: dto.notifyDailyEmail,
        notifyTopicAlertsEmail: dto.notifyTopicAlertsEmail,
        notifyWeeklyPush: dto.notifyWeeklyPush,
        notifyDailyPush: dto.notifyDailyPush,
        notifyTopicAlertsPush: dto.notifyTopicAlertsPush,
      },
      select: {
        id: true,
        notifyWeeklyEmail: true,
        notifyDailyEmail: true,
        notifyTopicAlertsEmail: true,
        notifyWeeklyPush: true,
        notifyDailyPush: true,
        notifyTopicAlertsPush: true,
      },
    });
  }

  async updateVisibility(
    userId: number,
    dto: UpdateVisibilityDto,
  ): Promise<Pick<User, 'id' | 'isPublic'>> {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isPublic: dto.isPublic },
      select: { id: true, isPublic: true },
    });
  }

  async unlinkOauth(
    userId: number,
    dto: UnlinkOauthDto,
  ): Promise<Pick<User, 'id' | 'provider' | 'providerId'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { provider: true, providerId: true },
    });
    if (!user) throw new NotFoundException('User not found');

    if (user.provider !== dto.provider) {
      throw new BadRequestException(
        `User not linked to provider ${dto.provider}`,
      );
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        provider: null,
        providerId: null,
      },
      select: {
        id: true,
        provider: true,
        providerId: true,
      },
    });
  }

  async exportUserData(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        language: true,
        country: true,
        favoriteTopics: true,
        createdAt: true,
        profilePhoto: true,
        bannerPhoto: true,
        provider: true,
        providerId: true,
        isPublic: true,
        notifyWeeklyEmail: true,
        notifyDailyEmail: true,
        notifyTopicAlertsEmail: true,
        notifyWeeklyPush: true,
        notifyDailyPush: true,
        notifyTopicAlertsPush: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
