import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UnprocessableEntityException,
} from '@nestjs/common';
import { catchError, map, Observable, tap, throwError } from 'rxjs';

export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    console.log(`Request accepted: ${req.method} ${req.url}`);
    return next.handle().pipe(tap(() => console.log('Request processed')));
  }
}
