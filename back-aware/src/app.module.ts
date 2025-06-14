import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { UploadModule } from './upload/upload.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    UploadModule,
    ArticlesModule,
  ],
})
export class AppModule {}
