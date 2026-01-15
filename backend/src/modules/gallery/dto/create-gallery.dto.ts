import { IsString, IsNotEmpty, IsOptional, IsArray, IsUrl } from 'class-validator';

export class CreateGalleryDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsUrl()
    @IsOptional()
    imageUrl?: string;

    @IsArray()
    @IsOptional()
    tags?: string[];
}

export class UpdateGalleryDto extends CreateGalleryDto { }
