import { IsDateString, IsNotEmpty, IsOptional, IsString, IsIn } from 'class-validator';

export class CreateSermonDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  speaker: string;

  @IsOptional()
  @IsString()
  preacher?: string;

  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsString()
  streamUrl?: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  notesUrl?: string;

  @IsDateString()
  preachedOn: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  scripture?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsIn(['video', 'audio'])
  type?: 'video' | 'audio';
}

export class UpdateSermonDto extends CreateSermonDto {}



