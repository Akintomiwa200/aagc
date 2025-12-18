import { IsString, IsOptional, IsEmail, IsIn, IsBoolean } from 'class-validator';

export class CreatePrayerDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  request: string;

  @IsOptional()
  @IsIn(['pending', 'ongoing', 'answered'])
  status?: 'pending' | 'ongoing' | 'answered';

  @IsOptional()
  @IsBoolean()
  isAnonymous?: boolean;
}

export class UpdatePrayerStatusDto {
  @IsString()
  @IsIn(['pending', 'ongoing', 'answered'])
  status: 'pending' | 'ongoing' | 'answered';
}

