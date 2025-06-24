import { ThreadDto } from './thread.dto';

export interface ArticleDto {
  id: string;
  url: string;
  source: string;
  title: string;
  description?: string;
  language: string;
  published: string;
  author?: string;
  content: string;
  image?: string;
  topics: string[];
  thread_id?: string;
  thread?: ThreadDto;
  views?: number;
  comments?: number;
}
