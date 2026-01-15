import { Controller, Get, Post, Put, Delete, Body, Param, Query, Inject, forwardRef } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('notes')
export class NotesController {
    constructor(
        private readonly notesService: NotesService,
        @Inject(forwardRef(() => AppGateway))
        private readonly appGateway: AppGateway,
    ) { }

    @Post()
    async create(@Body() dto: CreateNoteDto) {
        const note = await this.notesService.create(dto);
        this.appGateway.emitNoteCreated(note);
        return note;
    }

    @Get()
    async findAll(@Query('userId') userId: string) {
        return this.notesService.findAll(userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.notesService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: Partial<CreateNoteDto>) {
        const note = await this.notesService.update(id, dto);
        this.appGateway.emitNoteUpdated(note);
        return note;
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.notesService.delete(id);
        this.appGateway.emitNoteDeleted(id);
        return { message: 'Note deleted' };
    }
}
