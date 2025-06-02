import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import 'express-session';

interface GoogleUser {
  email: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  async register(
    @Body() registerDto: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.register(registerDto);
    const token = this.authService.login(user).access_token;

    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { accessToken: token };
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const tokenObj = this.authService.login(user);
    const jwt = tokenObj.access_token;

    res.cookie('jwt', jwt, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { accessToken: jwt };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete-account')
  async deleteAccount(@Req() req: Request) {
    if (!req.user) {
      throw new BadRequestException('User not authenticated');
    }
    const userId = req.user['userId'] ?? req.user['sub'];
    if (!userId) {
      throw new BadRequestException('User ID not found');
    }
    await this.prisma.user.delete({ where: { id: Number(userId) } });
    return { message: 'Account deleted successfully' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // redirects to Google OAuth consent screen
  }

  @Get('google/start')
  async googleStart(@Req() req: Request, @Res() res: Response) {
    req.session.mode = req.query.mode === 'signup' ? 'signup' : 'login';
    req.session.save(() => {
      res.redirect('/auth/google');
    });
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Req() req: Request & { user: GoogleUser },
    @Res() res: Response,
  ) {
    const rawMode = req.session?.mode;
    const mode: 'login' | 'signup' = rawMode === 'signup' ? 'signup' : 'login';

    try {
      const result = await this.authService.googleLogin(req.user, mode);
      const jwt = result.token;

      res.cookie('jwt', jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      if (mode === 'signup') {
        const email = encodeURIComponent(req.user.email);
        return res.redirect(
          `http://localhost:5173/createprofile?email=${email}&accessToken=${jwt}`,
        );
      }

      return res.redirect(`http://localhost:5173/home?accessToken=${jwt}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      } else {
        return res.status(400).json({ message: 'Unknown error occurred' });
      }
    }
  }

  @Get('clear-session')
  clearSession(@Req() req: Request, @Res() res: Response) {
    req.session.destroy(() => {
      res.send('Session cleared');
    });
  }
}
