import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomForbiddenException extends HttpException {
  constructor(role: string) {
    super(`Access not allowed for ${role}`, HttpStatus.FORBIDDEN);
  }
}
