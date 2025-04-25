import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('env')
  showEnv() {
    return {
      db: this.appService.getDbUrl(),
    };
  }

  @Get('test-users')
  async testUsers() {
    return this.prisma.user.findMany();
  }
}
