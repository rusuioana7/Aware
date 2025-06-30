import { Controller, Get, Param } from '@nestjs/common';
import { ThreadsService } from './threads.service';

@Controller('threads')
export class ThreadsController {
  constructor(private readonly svc: ThreadsService) {}

  @Get(':id')
  getThread(@Param('id') id: string) {
    return this.svc.findOne(id);
  }
  @Get()
  async getAllThreads() {
    const result = await this.svc.findAll();
    return result;
  }
}
