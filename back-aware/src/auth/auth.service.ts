import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    const { email, password, confirmPassword } = registerUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });

    await this.prisma.bookmarkFolder.create({
      data: {
        name: 'Save for Later',
        color: '#999999',
        articleIds: [],
        user: { connect: { id: user.id } },
      },
    });

    return user;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    return user;
  }

  login(user: User): { access_token: string } {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async googleLogin(user, mode: 'login' | 'signup' = 'login') {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (mode === 'signup') {
      if (existingUser) {
        throw new BadRequestException(
          'Account already exists. Please sign in.',
        );
      }
      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          provider: user.provider,
        },
      });
      await this.prisma.bookmarkFolder.create({
        data: {
          name: 'Save for Later',
          color: '#000000',
          articleIds: [],
          user: { connect: { id: user.id } },
        },
      });
      const token = this.jwtService.sign({
        email: newUser.email,
        sub: newUser.id,
      });
      return { message: 'Registered and logged in with Google', token };
    }

    // mode === 'login'
    if (!existingUser) {
      throw new BadRequestException('Account does not exist. Please sign up.');
    }
    const token = this.jwtService.sign({
      email: existingUser.email,
      sub: existingUser.id,
    });
    return { message: 'Logged in with Google', token };
  }
}
