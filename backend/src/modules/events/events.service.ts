import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto, UpdateEventDto } from './dto/create-event.dto';
import { Event, EventDocument } from './schemas/event.schema';

@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<EventDocument>) {}

  async create(dto: CreateEventDto) {
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

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.eventModel.findByIdAndUpdate(id, dto, { new: true }).lean();
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  async delete(id: string) {
    const result = await this.eventModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Event not found');
    return { message: 'Event deleted successfully' };
  }

  async registerForEvent(id: string) {
    const event = await this.eventModel.findById(id);
    if (!event) throw new NotFoundException('Event not found');
    event.registrations = (event.registrations || 0) + 1;
    return event.save();
  }
}



