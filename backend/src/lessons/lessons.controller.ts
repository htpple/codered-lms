import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { LessonsService } from './lessons.service';
import { Roles } from 'src/auth/roles.decorator';
import { CreateLessonDto } from './dto/create-lesson.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private readonly lessonService: LessonsService) {}

  @Roles('ADMIN', 'TEACHER')
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateLessonDto) {
    return this.lessonService.create(dto);
  }

  @Roles('ADMIN', 'TEACHER')
  @Get()
  findAll() {
    return this.lessonService.findAll();
  }

  @Roles('ADMIN', 'TEACHER')
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lessonService.findOne(id);
  }
}
