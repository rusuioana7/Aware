import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SettingsController } from './settings.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UsersController, SettingsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
