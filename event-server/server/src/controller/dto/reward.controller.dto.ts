import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class RewardControllerDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
