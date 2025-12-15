import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBotDto {
  @IsNotEmpty()
  @IsString()
  studentId: string;

  @IsNotEmpty()
  @IsString()
  studentName: string;

  @IsNotEmpty()
  @IsEmail()
  studentEmail: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  description: string;
}
