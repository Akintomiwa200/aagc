import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { DonationsService } from './donations.service';
import { CreateDonationDto } from './dto/create-donation.dto';

@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  @Post()
  create(@Body() dto: CreateDonationDto) {
    return this.donationsService.create(dto);
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

