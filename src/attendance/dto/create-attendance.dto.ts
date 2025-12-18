import { IsNotEmpty, IsMongoId, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateAttendanceDto {
  @IsMongoId()
  @IsNotEmpty()
  studentId: string;

  @IsMongoId()
  @IsNotEmpty()
  groupId: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
