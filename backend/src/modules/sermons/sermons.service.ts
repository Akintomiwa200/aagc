import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSermonDto } from './dto/create-sermon.dto';
import { Sermon, SermonDocument } from './schemas/sermon.schema';

@Injectable()
export class SermonsService {
  constructor(@InjectModel(Sermon.name) private sermonModel: Model<SermonDocument>) {}

  create(dto: CreateSermonDto) {
    const created = new this.sermonModel(dto);
    return created.save();
  }

  findAll() {
    return this.sermonModel.find().sort({ preachedOn: -1 }).lean();
  }

  async findOne(id: string) {
    const sermon = await this.sermonModel.findById(id).lean();
    if (!sermon) throw new NotFoundException('Sermon not found');
    return sermon;
  }
}

