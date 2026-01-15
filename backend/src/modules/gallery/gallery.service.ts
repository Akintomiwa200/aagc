import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallery, GalleryDocument } from './schemas/gallery.schema';
import { CreateGalleryDto, UpdateGalleryDto } from './dto/create-gallery.dto';

@Injectable()
export class GalleryService {
    constructor(
        @InjectModel(Gallery.name) private galleryModel: Model<GalleryDocument>,
    ) { }

    async create(dto: CreateGalleryDto) {
        const created = new this.galleryModel(dto);
        return created.save();
    }

    async findAll() {
        return this.galleryModel.find().sort({ createdAt: -1 }).lean();
    }

    async findOne(id: string) {
        const item = await this.galleryModel.findById(id).lean();
        if (!item) throw new NotFoundException('Gallery item not found');
        return item;
    }

    async update(id: string, dto: UpdateGalleryDto) {
        const item = await this.galleryModel.findByIdAndUpdate(id, dto, { new: true }).lean();
        if (!item) throw new NotFoundException('Gallery item not found');
        return item;
    }

    async delete(id: string) {
        const result = await this.galleryModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('Gallery item not found');
        return { message: 'Gallery item deleted successfully' };
    }

    async like(id: string) {
        const item = await this.galleryModel.findByIdAndUpdate(
            id,
            { $inc: { likes: 1 } },
            { new: true },
        ).lean();
        if (!item) throw new NotFoundException('Gallery item not found');
        return item;
    }
}
