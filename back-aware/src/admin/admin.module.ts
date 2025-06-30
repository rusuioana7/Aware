import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ArticlesModule } from '../articles/articles.module';
import { ThreadsModule } from '../threads/threads.module';
import { FeedModule } from '../feed/feed.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ArticlesModule,
    ThreadsModule,
    FeedModule,
  ],
  controllers: [AdminController],
})
export class AdminModule {}
