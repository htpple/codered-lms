import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

interface UniqueConstraintError {
  code: 'P2002';
  meta?: { target?: string[] };
}

function isUniqueConstraintError(
  error: unknown,
): error is UniqueConstraintError {
  if (
    typeof error === 'object' &&
    error !== null &&
    // здесь проверяем наличие поля code
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (error as any).code === 'P2002'
  ) {
    return true;
  }
  return false;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(dto.password, salt);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          password: hash,
          role: dto.role || 'STUDENT',
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return rest;
    } catch (error: unknown) {
      // сначала убеждаемся, что это конфликт уникальности
      if (isUniqueConstraintError(error)) {
        // здесь TS знает, что error.meta?.target — string[]
        if (error.meta?.target?.includes('email')) {
          throw new ConflictException('Email already in use');
        }
      }
      // иначе пробрасываем дальше
      throw error;
    }
  }

  async findAll() {
    // не возвращаем пароль
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
