import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';
import { SubjectsModule } from './subjects/subjects.module';
import { LessonsModule } from './lessons/lessons.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    GroupsModule,
    SubjectsModule,
    LessonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
