import { Controller, Get, Post, Put, Delete, Body, Param, UseInterceptors, UploadedFile, Inject, forwardRef } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/create-gallery.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('gallery')
export class GalleryController {
    constructor(
        private readonly galleryService: GalleryService,
        private readonly cloudinaryService: CloudinaryService,
        @Inject(forwardRef(() => AppGateway))
        private readonly websocketGateway: AppGateway,
    ) { }

    @Post()
    @UseInterceptors(FileInterceptor('image'))
    async create(
        @Body() body: any,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        const dto: CreateGalleryDto = typeof body === 'string' ? JSON.parse(body) : body;
        if (file) {
            const upload = await this.cloudinaryService.uploadFile(file, 'aagc/gallery');
            dto.imageUrl = upload.secure_url;
        }
        const item = await this.galleryService.create(dto);
        await this.websocketGateway.emitGalleryImageCreated(item);
        return item;
    }

    @Get()
    findAll() {
        return this.galleryService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.galleryService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateGalleryDto) {
        const item = await this.galleryService.update(id, dto);
        await this.websocketGateway.emitGalleryImageUpdated(item);
        return item;
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.galleryService.delete(id);
        await this.websocketGateway.emitGalleryImageDeleted(id);
        return { message: 'Deleted successfully' };
    }

    @Post(':id/like')
    async like(@Param('id') id: string) {
        const item = await this.galleryService.like(id);
        await this.websocketGateway.emitGalleryImageUpdated(item);
        return item;
    }
}
