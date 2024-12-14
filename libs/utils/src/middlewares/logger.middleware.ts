import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: Logger = new Logger();
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.verbose(`Request accepted: ${req.method} ${req.url}`);
    next();
  }
}
// export function logger(req: Request, res: Response, next: NextFunction) {
//   console.log(`Request accepted: ${req.method} ${req.url}`);
//   next();
// }
