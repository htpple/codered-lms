import { IsArray, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';

export class UpdateGroupDto {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  studentIds: number[];
}
