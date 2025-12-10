import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  create(dto: CreateEventDto) {
    const created = new this.eventModel(dto);
    return created.save();
  }

  findAll() {
    return this.eventModel.find().sort({ date: 1 }).lean();
  }

  async findOne(id: string) {
    const event = await this.eventModel.findById(id).lean();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }
}

