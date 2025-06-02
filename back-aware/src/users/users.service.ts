import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  async findById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateProfile(userId: number, data: UpdateProfileDto): Promise<User> {
    this.logger.log(
      `Updating user ${userId} with data: ${JSON.stringify(data)}`,
    );
    try {
      const updated = await this.prisma.user.update({
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
      });
      this.logger.log(`Updated user: ${JSON.stringify(updated)}`);
      return updated;
    } catch (error: unknown) {
      this.logger.error(`Failed to update user ${userId}: ${error}`);
      throw error;
    }
  }
}
