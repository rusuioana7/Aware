import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { ArticlesModule } from './articles/articles.module';
import { ThreadsModule } from './threads/threads.module';
import { FeedModule } from './feed/feed.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { SearchModule } from './search/search.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    UploadModule,
    ArticlesModule,
    ThreadsModule,
    FeedModule,
    BookmarksModule,
    SearchModule,
    AdminModule,
  ],
})
export class AppModule {}
