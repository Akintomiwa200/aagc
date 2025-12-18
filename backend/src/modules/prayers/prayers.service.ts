import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prayer, PrayerDocument } from './schemas/prayer.schema';
import { CreatePrayerDto, UpdatePrayerStatusDto } from './dto/create-prayer.dto';

@Injectable()
export class PrayersService {
  constructor(@InjectModel(Prayer.name) private prayerModel: Model<PrayerDocument>) {}

  async create(dto: CreatePrayerDto) {
    const created = new this.prayerModel(dto);
    return created.save();
  }

  async findAll() {
    return this.prayerModel.find().sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    const prayer = await this.prayerModel.findById(id).lean();
    if (!prayer) throw new NotFoundException('Prayer request not found');
    return prayer;
  }

  async updateStatus(id: string, dto: UpdatePrayerStatusDto) {
    const prayer = await this.prayerModel.findByIdAndUpdate(
      id,
      { status: dto.status },
      { new: true }
    ).lean();
    if (!prayer) throw new NotFoundException('Prayer request not found');
    return prayer;
  }

  async delete(id: string) {
    const result = await this.prayerModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Prayer request not found');
    return { message: 'Prayer request deleted successfully' };
  }

  async getStats() {
    const total = await this.prayerModel.countDocuments();
    const pending = await this.prayerModel.countDocuments({ status: 'pending' });
    const ongoing = await this.prayerModel.countDocuments({ status: 'ongoing' });
    const answered = await this.prayerModel.countDocuments({ status: 'answered' });
    return { total, pending, ongoing, answered };
  }
}

