import { Injectable, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from '@prisma/client';

export interface GoogleUser {
  email: string;
  name: string;
  provider: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ message: string; userId: number }> {
    const { email, password, confirmPassword } = registerUserDto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser: User | null = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { message: 'Registration successful', userId: user.id };
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

  async googleLogin(user) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existingUser) {
      const newUser = await this.prisma.user.create({
        data: {
          email: user.email,
          name: user.name,
          provider: user.provider,
        },
      });
      const token = this.jwtService.sign({
        email: newUser.email,
        sub: newUser.id,
      });
      return { message: 'Registered and logged in with Google', token };
    }

    const token = this.jwtService.sign({
      email: existingUser.email,
      sub: existingUser.id,
    });
    return { message: 'Logged in with Google', token };
  }
}
