import { IsInt, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateAttendanceDto {
  @IsInt()
  @Type(() => Number) // Transform string to number
  studentId: number;

  @IsBoolean()
  @Type(() => Boolean) // Transform string to boolean
  present: boolean;

  @IsOptional()
  @IsInt()
  @Type(() => Number) // Transform string to number
  grade?: number;
}
