import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsController } from './settings.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [UsersController, SettingsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
