import { Origin } from '@libs/utils';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const req: Request = ctx.getRequest();
    const allowedOrigins = this.reflector.get(Origin, context.getHandler());
    // const allowedOrigins = this.reflector.get('origins', context.getHandler());
    return allowedOrigins.includes(req.hostname);
  }
}
