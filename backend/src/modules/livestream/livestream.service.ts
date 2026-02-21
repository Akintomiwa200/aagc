import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LiveStream, LiveStreamDocument } from './schemas/livestream.schema';

@Injectable()
export class LiveStreamService {
    constructor(
        @InjectModel(LiveStream.name) private model: Model<LiveStreamDocument>,
    ) { }

    async getLive() {
        return this.model.findOne({ isLive: true }).lean();
    }

    async findAll() {
        return this.model.find().sort({ scheduledStartTime: -1 }).lean();
    }

    async findOne(id: string) {
        return this.model.findById(id).lean();
    }

    async create(dto: any) {
        const created = new this.model(dto);
        return created.save();
    }

    async update(id: string, dto: any) {
        return this.model.findByIdAndUpdate(id, dto, { new: true }).lean();
    }

    async goLive(id: string) {
        return this.model.findByIdAndUpdate(id, { isLive: true, viewerCount: 0 }, { new: true }).lean();
    }

    async endStream(id: string) {
        return this.model.findByIdAndUpdate(id, { isLive: false, viewerCount: 0 }, { new: true }).lean();
    }

    async updateViewerCount(id: string, count: number) {
        return this.model.findByIdAndUpdate(id, { viewerCount: count }, { new: true }).lean();
    }
}
