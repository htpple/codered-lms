import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group, Prisma } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

type GroupWithStudents = Prisma.GroupGetPayload<{
  include: { students: { select: { id: true; email: true } } };
}>;

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateGroupDto): Promise<Group> {
    const group = this.prisma.group.create({
      data: { name: dto.name },
    });
    return group;
  }

  findAll(): Promise<GroupWithStudents[]> {
    return this.prisma.group.findMany({
      include: {
        students: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findOne(id: number): Promise<GroupWithStudents> {
    try {
      return await this.prisma.group.findUniqueOrThrow({
        where: { id },
        include: {
          students: { select: { id: true, email: true } },
        },
      });
    } catch {
      throw new NotFoundException(`Группа с id=${id} не найдена`);
    }
  }

  async updateMembers(groupId: number, studentIds: number[]) {
    // 1) Очищаем у всех пользователей, где groupId == this.groupId
    await this.prisma.user.updateMany({
      where: { groupId },
      data: { groupId: null },
    });

    // 2) Присваиваем новую группу нужным студентам
    await this.prisma.user.updateMany({
      where: { id: { in: studentIds } },
      data: { groupId },
    });

    return this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        students: { select: { id: true, email: true } },
      },
    });
  }
}
