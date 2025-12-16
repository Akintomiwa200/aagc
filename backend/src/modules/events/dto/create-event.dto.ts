import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  location?: string;
}



