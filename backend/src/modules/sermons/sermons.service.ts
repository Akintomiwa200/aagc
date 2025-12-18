import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSermonDto, UpdateSermonDto } from './dto/create-sermon.dto';
import { Sermon, SermonDocument } from './schemas/sermon.schema';

@Injectable()
export class SermonsService {
  constructor(@InjectModel(Sermon.name) private sermonModel: Model<SermonDocument>) {}

  async create(dto: CreateSermonDto) {
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

  async update(id: string, dto: UpdateSermonDto) {
    const sermon = await this.sermonModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!sermon) throw new NotFoundException('Sermon not found');
    return sermon;
  }

  async delete(id: string) {
    const result = await this.sermonModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Sermon not found');
    return { message: 'Sermon deleted successfully' };
  }
}



