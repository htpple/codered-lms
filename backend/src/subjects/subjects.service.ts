import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { Subject } from '@prisma/client';

@Injectable()
export class SubjectsService {
  constructor(private readonly prismaService: PrismaService) {}

  create(dto: CreateSubjectDto): Promise<Subject> {
    return this.prismaService.subject.create({
      data: {
        name: dto.name,
      },
    });
  }

  findAll(): Promise<Subject[]> {
    return this.prismaService.subject.findMany();
  }

  async findOne(id: number): Promise<Subject> {
    const subject = await this.prismaService.subject.findUnique({
      where: { id },
    });
    if (!subject) {
      throw new NotFoundException(`Subject с id=${id} не найден`);
    }

    return subject;
  }
}
