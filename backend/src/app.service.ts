import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService) {}

  getDbUrl() {
    // прочитаем из .env
    const url = this.config.get<string>('DATABASE_URL');
    return url;
  }

  getJwtSecret() {
    // прочитаем из .env
    const secret = this.config.get<string>('JWT_SECRET');
    return secret;
  }

  getHello(): string {
    return 'Hello World!';
  }
}
