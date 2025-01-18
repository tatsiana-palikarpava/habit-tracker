import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import configuration from 'config/configuration';
import { AuthUserType, JwtTokenPayload } from '../types/auth-user.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configuration().auth.jwtSecret,
    });
  }

  validate(payload: JwtTokenPayload): AuthUserType {
    return { userId: payload.sub, name: payload.name };
  }
}
