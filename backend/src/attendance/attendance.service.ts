import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';
import type { Attendance } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Сохраняет или обновляет отметки для одного урока.
   * 1. Проверяем, что урок есть.
   * 2. Запрещаем до начала урока.
   * 3. Для каждой записи делаем upsert: либо обновляем, либо создаём.
   */

  async mark(lessonId: number, dto: MarkAttendanceDto): Promise<Attendance[]> {
    // 1) Убедимся, что урок существует
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id=${lessonId} not found`);
    }

    // 2) Нельзя отмечать до начала урока (scheduledAt)
    if (new Date() < lesson.scheduledAt) {
      throw new ForbiddenException(
        `Отметки можно делать только после начала урока`,
      );
    }

    // 3) Для каждой записи делаем upsert: либо обновляем, либо создаём
    const result: Attendance[] = [];

    for (const rec of dto.records) {
      const attendance = await this.prismaService.attendance.upsert({
        where: {
          lessonId_studentId: {
            lessonId,
            studentId: rec.studentId,
          },
        },
        update: {
          present: rec.present,
          grade: rec.grade,
        },
        create: {
          lessonId,
          studentId: rec.studentId,
          present: rec.present,
          grade: rec.grade,
        },
      });
      result.push(attendance);
    }

    return result;
  }

  findByLesson(lessonId: number) {
    return this.prismaService.attendance.findMany({
      where: { lessonId },
      include: {
        student: { select: { id: true, email: true } },
      },
    });
  }
}
