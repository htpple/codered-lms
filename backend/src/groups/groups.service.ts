import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group, Prisma } from '@prisma/client';

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

  async findOne(groupId: number): Promise<GroupWithStudents> {
    try {
      return await this.prisma.group.findUniqueOrThrow({
        where: { id: groupId },
        include: {
          students: { select: { id: true, email: true } },
        },
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException(`Группа с id=${groupId} не найдена`);
      }
      throw e;
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

  async rename(groupId: number, newName: string): Promise<Group> {
    // убедимся, что группа существует (чтобы бросить 404, а не молча создать)
    await this.findOne(groupId);
    return this.prisma.group.update({
      where: { id: groupId },
      data: { name: newName },
    });
  }
}
