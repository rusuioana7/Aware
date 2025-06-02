import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

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
  constructor(private readonly prisma: PrismaService) {}

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
}
