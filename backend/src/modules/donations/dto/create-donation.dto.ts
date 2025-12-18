import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateDonationDto {
  @IsString()
  userId: string;

  @IsEnum(['Tithe', 'Offering', 'Seed', 'Building', 'Other'])
  type: 'Tithe' | 'Offering' | 'Seed' | 'Building' | 'Other';

  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

