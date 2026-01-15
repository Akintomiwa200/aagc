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

    async create(dto: any) {
        const created = new this.model(dto);
        return created.save();
    }
}
