import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  Res,
  UseGuards,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import 'express-session';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterUserDto) {
    return this.authService.register(registerDto);
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

    const token = this.authService.login(user);

    res.cookie('jwt', token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    });

    return { message: 'Login successful' };
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
    const mode = req.query.mode === 'signup' ? 'signup' : 'login';
    req.session.mode = mode;
    console.log('✅ Setat mode în sesiune:', req.session.mode);
    console.log(' sesiune dupa setare:', req.session);
    req.session.save(() => {
      res.redirect('/auth/google');
    });
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const rawMode = req.session?.mode;
    const mode: 'login' | 'signup' = rawMode === 'signup' ? 'signup' : 'login';

    console.log('➡️ Google Redirect:');
    console.log('Mode from session:', mode);
    console.log('User:', req.user);
    console.log('⛔ Mode în sesiune la redirect:', req.session?.mode);

    try {
      const result = await this.authService.googleLogin(req.user, mode);

      res.cookie('jwt', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24,
      });

      res.redirect('http://localhost:5173/home');
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: 'Unknown error occurred' });
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
