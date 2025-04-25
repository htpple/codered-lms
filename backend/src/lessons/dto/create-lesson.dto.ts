import { IsInt, IsDateString, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonDto {
  @IsInt()
  @Type(() => Number) // Transform string to number
  groupId: number;

  @IsInt()
  @Type(() => Number) // Transform string to number
  subjectId: number;

  @IsDateString()
  scheduledAt: string; // ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)

  @IsOptional()
  @IsString()
  topic?: string; // Optional field for the lesson topic
}
// This DTO is used to create a new lesson. It includes the group ID, subject ID, schedule date, and an optional topic.
// The `@IsDateString()` decorator ensures that the `scheduleAt` field is a valid date string in ISO 8601 format.
// The `@IsOptional()` decorator indicates that the `topic` field is optional.
