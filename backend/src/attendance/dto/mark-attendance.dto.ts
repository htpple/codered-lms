import { Type } from 'class-transformer';
import { ValidateNested, ArrayNotEmpty } from 'class-validator';

import { CreateAttendanceDto } from './create-attendance.dto';

export class MarkAttendanceDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateAttendanceDto)
  records: CreateAttendanceDto[];
}
