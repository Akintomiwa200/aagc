import { IsDateString, IsNotEmpty, IsOptional, IsString, IsNumber, IsIn } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  time?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  registrationDeadline?: string;

  @IsOptional()
  @IsIn(['upcoming', 'ongoing', 'completed'])
  status?: 'upcoming' | 'ongoing' | 'completed';

  @IsOptional()
  @IsString()
  type?: string;
}

export class UpdateEventDto extends CreateEventDto {}



