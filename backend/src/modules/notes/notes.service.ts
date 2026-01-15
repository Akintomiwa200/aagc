import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from './schemas/note.schema';
import { CreateNoteDto } from './dto/create-note.dto';

@Injectable()
export class NotesService {
    constructor(
        @InjectModel(Note.name) private noteModel: Model<NoteDocument>,
    ) { }

    async create(dto: CreateNoteDto) {
        const created = new this.noteModel(dto);
        return created.save();
    }

    async findAll(userId: string) {
        return this.noteModel.find({ userId }).sort({ updatedAt: -1 }).lean();
    }

    async findOne(id: string) {
        const note = await this.noteModel.findById(id).lean();
        if (!note) throw new NotFoundException('Note not found');
        return note;
    }

    async update(id: string, dto: Partial<CreateNoteDto>) {
        const note = await this.noteModel.findByIdAndUpdate(id, dto, { new: true }).lean();
        if (!note) throw new NotFoundException('Note not found');
        return note;
    }

    async delete(id: string) {
        const result = await this.noteModel.findByIdAndDelete(id);
        if (!result) throw new NotFoundException('Note not found');
        return { message: 'Note deleted' };
    }
}
