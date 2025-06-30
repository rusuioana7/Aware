import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { CommentsModule } from '../comments/comments.module';

@Module({
  imports: [HttpModule, CommentsModule],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [ArticlesService],
})
export class ArticlesModule {}
