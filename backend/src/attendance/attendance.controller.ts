import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

/**
 * Контроллер для работы с отметками посещаемости.
 * 1. Отметка посещаемости
 * 2. Получение всех отметок по уроку
 */
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('lessons/:lessonId/attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Roles('ADMIN', 'TEACHER')
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  mark(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @Body() dto: MarkAttendanceDto,
  ) {
    return this.attendanceService.mark(lessonId, dto);
  }

  @Roles('ADMIN', 'TEACHER')
  @Get()
  getAll(@Param('lessonId', ParseIntPipe) lessonId: number) {
    return this.attendanceService.findByLesson(lessonId);
  }
}
