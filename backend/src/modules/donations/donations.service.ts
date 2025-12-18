import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from './schemas/donation.schema';
import { CreateDonationDto } from './dto/create-donation.dto';

@Injectable()
export class DonationsService {
  constructor(@InjectModel(Donation.name) private donationModel: Model<DonationDocument>) {}

  async create(dto: CreateDonationDto) {
    const created = new this.donationModel({
      ...dto,
      status: 'Successful', // In production, integrate with payment gateway
      transactionId: `TXN-${Date.now()}`,
    });
    return created.save();
  }

  async findAll(userId?: string) {
    const query = userId ? { userId } : {};
    return this.donationModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async findOne(id: string) {
    return this.donationModel.findById(id).lean();
  }

  async getUserDonations(userId: string) {
    return this.donationModel.find({ userId }).sort({ createdAt: -1 }).lean();
  }
}

