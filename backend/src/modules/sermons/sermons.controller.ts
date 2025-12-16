import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SermonsService } from './sermons.service';
import { CreateSermonDto } from './dto/create-sermon.dto';

@Controller('sermons')
export class SermonsController {
  constructor(private readonly sermonsService: SermonsService) {}

  @Get()
  list() {
    return this.sermonsService.findAll();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.sermonsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSermonDto) {
    return this.sermonsService.create(dto);
  }
}



