import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { Request } from 'express';

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface JwtUser {
  id: number;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request | null): string | null => {
          if (
            req &&
            typeof req.cookies === 'object' &&
            typeof req.cookies.jwt === 'string'
          ) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return req.cookies.jwt;
          }
          return null;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  validate(req: Request, payload: JwtPayload): JwtUser {
    const user: JwtUser = {
      id: payload.sub,
      email: payload.email,
    };
    return user;
  }
}
