// src/bookmarks/bookmarks.module.ts
import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { PrismaService } from '../prisma/prisma.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [BookmarksService, PrismaService],
  controllers: [BookmarksController],
})
export class BookmarksModule {}
