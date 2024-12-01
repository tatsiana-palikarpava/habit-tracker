import { Injectable } from '@nestjs/common';

@Injectable()
export class DBConnectionOptions {
  get() {
    return {
      host: 'localhost',
      port: 5432,
    };
  }
}
