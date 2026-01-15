import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateNoteDto {
    @IsString()
    @IsNotEmpty()
    userId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsArray()
    @IsOptional()
    tags?: string[];
}
