import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDevotionalDto, UpdateDevotionalDto } from './dto/create-devotional.dto';
import { Devotional, DevotionalDocument } from './schemas/devotional.schema';

@Injectable()
export class DevotionalsService {
  constructor(
    @InjectModel(Devotional.name) private devotionalModel: Model<DevotionalDocument>,
  ) {}

  async create(dto: CreateDevotionalDto) {
    const created = new this.devotionalModel(dto);
    return created.save();
  }

  findAll(status?: 'published' | 'draft') {
    const query = status ? { status } : {};
    return this.devotionalModel.find(query).sort({ date: -1 }).lean();
  }

  async findOne(id: string) {
    const devotional = await this.devotionalModel.findById(id).lean();
    if (!devotional) throw new NotFoundException('Devotional not found');
    
    // Increment views
    await this.devotionalModel.findByIdAndUpdate(id, { $inc: { views: 1 } });
    
    return devotional;
  }

  async getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const devotional = await this.devotionalModel
      .findOne({
        date: {
          $gte: today.toISOString(),
          $lt: tomorrow.toISOString(),
        },
        status: 'published',
      })
      .sort({ date: -1 })
      .lean();

    if (!devotional) {
      // Return the most recent published devotional if no today's devotional
      return this.devotionalModel
        .findOne({ status: 'published' })
        .sort({ date: -1 })
        .lean();
    }

    return devotional;
  }

  async update(id: string, dto: UpdateDevotionalDto) {
    const devotional = await this.devotionalModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!devotional) throw new NotFoundException('Devotional not found');
    return devotional;
  }

  async delete(id: string) {
    const result = await this.devotionalModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Devotional not found');
    return { message: 'Devotional deleted successfully' };
  }

  async like(id: string) {
    const devotional = await this.devotionalModel.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    ).lean();
    if (!devotional) throw new NotFoundException('Devotional not found');
    return devotional;
  }
}

