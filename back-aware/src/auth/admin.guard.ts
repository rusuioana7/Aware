import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const user = req.user as { email?: string };
    if (user?.email === process.env.ADMIN_EMAIL) {
      return true;
    }
    throw new ForbiddenException('Admin access required');
  }
}
