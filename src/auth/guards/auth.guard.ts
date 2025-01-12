import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtTokenPayload } from '../types/auth-user.type';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req: Request = ctx.getRequest();
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException();
    }
    let decodedData: JwtTokenPayload;
    try {
      decodedData = await this.jwtService.verifyAsync(token);
    } catch (e) {
      throw new UnauthorizedException(e.message);
    }
    req['user'] = {
      userId: decodedData.sub,
      name: decodedData.name,
    };
    return true;
  }
}
