import { Injectable } from '@nestjs/common';

@Injectable()
export class DBConnection {
  private host: string;
  private port: number;
  constructor(options: { host: string; port: number }) {
    this.host = options.host;
    this.port = options.port;
    console.log(`Connection established ${options.host}:${options.port}`);
  }

  ping() {
    console.log(`Ping ${this.host}:${this.port}`);
  }
}
