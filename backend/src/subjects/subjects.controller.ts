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
import { Roles } from 'src/auth/roles.decorator';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subjects.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Roles('ADMIN')
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.create(dto);
  }

  @Roles('ADMIN', 'TEACHER')
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.subjectsService.findOne(id);
  }
}
