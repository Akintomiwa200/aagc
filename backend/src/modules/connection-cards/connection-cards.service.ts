import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConnectionCard, ConnectionCardDocument } from './schemas/connection-card.schema';

@Injectable()
export class ConnectionCardsService {
    constructor(
        @InjectModel(ConnectionCard.name) private model: Model<ConnectionCardDocument>,
    ) { }

    async create(dto: any) {
        const created = new this.model(dto);
        return created.save();
    }

    async findAll() {
        return this.model.find().sort({ createdAt: -1 }).lean();
    }
}
