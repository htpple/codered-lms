import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import type { Lesson } from '@prisma/client';

@Injectable()
export class LessonsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(dto: CreateLessonDto): Promise<Lesson> {
    //проверяем группу
    const group = await this.prismaService.group.findUnique({
      where: { id: dto.groupId },
    });

    if (!group) {
      throw new NotFoundException(`Group with id=${dto.groupId} not found`);
    }

    //проверяем предмет
    const subject = await this.prismaService.subject.findUnique({
      where: { id: dto.subjectId },
    });
    if (!subject) {
      throw new NotFoundException(`Subject with id=${dto.subjectId} not found`);
    }

    return this.prismaService.lesson.create({
      data: {
        groupId: dto.groupId,
        subjectId: dto.subjectId,
        scheduledAt: new Date(dto.scheduledAt),
        topic: dto.topic,
      },
    });
  }

  findAll(): Promise<Lesson[]> {
    return this.prismaService.lesson.findMany({
      include: {
        group: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
    });
  }

  async findOne(id: number): Promise<Lesson> {
    const lesson = await this.prismaService.lesson.findUnique({
      where: { id },
      include: {
        group: { select: { id: true, name: true } },
        subject: { select: { id: true, name: true } },
      },
    });

    if (!lesson) {
      throw new NotFoundException(`Lesson with id=${id} not found`);
    }

    return lesson;
  }
}
