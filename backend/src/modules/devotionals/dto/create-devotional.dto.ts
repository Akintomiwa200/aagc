import { IsNotEmpty, IsOptional, IsString, IsIn, IsArray, IsObject, IsNumber } from 'class-validator';

export class BibleReferenceDto {
  @IsNotEmpty()
  @IsString()
  book: string;

  @IsNotEmpty()
  @IsNumber()
  chapter: number;

  @IsNotEmpty()
  @IsNumber()
  verse: number;

  @IsOptional()
  @IsNumber()
  endVerse?: number;
}

export class CreateDevotionalDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  author: string;

  @IsOptional()
  @IsString()
  authorRole?: string;

  @IsOptional()
  @IsString()
  authorBio?: string;

  @IsNotEmpty()
  @IsString()
  date: string;

  @IsOptional()
  @IsString()
  scripture?: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  reflection?: string;

  @IsOptional()
  @IsString()
  application?: string;

  @IsOptional()
  @IsString()
  prayer?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsObject()
  bibleReference?: BibleReferenceDto;

  @IsOptional()
  @IsIn(['published', 'draft'])
  status?: 'published' | 'draft';
}

export class UpdateDevotionalDto extends CreateDevotionalDto {}

