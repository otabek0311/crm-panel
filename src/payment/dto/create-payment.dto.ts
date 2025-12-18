import { IsNotEmpty, IsNumber, IsMongoId, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsNotEmpty()
  paymentDate: Date;

  @IsString()
  @IsOptional()
  method?: string;

  @IsString()
  @IsOptional()
  comment?: string;
}
