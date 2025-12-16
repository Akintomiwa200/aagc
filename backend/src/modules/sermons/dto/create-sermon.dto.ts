import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSermonDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  speaker: string;

  @IsOptional()
  series?: string;

  @IsOptional()
  streamUrl?: string;

  @IsOptional()
  notesUrl?: string;

  @IsDateString()
  preachedOn: string;
}



