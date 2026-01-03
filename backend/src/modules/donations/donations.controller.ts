import { Controller, Get, Post, Body, Param, Query, Inject, forwardRef } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('donations')
export class DonationsController {
  constructor(
    private readonly donationsService: DonationsService,
    @Inject(forwardRef(() => AppGateway))
    private readonly websocketGateway: AppGateway,
  ) { }

  @Post()
  async create(@Body() dto: CreateDonationDto) {
    const donation = await this.donationsService.create(dto);
    await this.websocketGateway.emitDonationCreated(donation);
    return donation;
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.donationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.donationsService.findOne(id);
  }

  @Get('user/:userId')
  getUserDonations(@Param('userId') userId: string) {
    return this.donationsService.getUserDonations(userId);
  }
}

