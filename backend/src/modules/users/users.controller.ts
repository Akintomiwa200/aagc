import { Body, Controller, Get, Param, Post, Put, Delete, Inject, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AppGateway))
    private readonly websocketGateway: AppGateway,
  ) { }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.usersService.create(dto);
    await this.websocketGateway.emitMemberCreated(user);
    return user;
  }

  @Get()
  list() {
    return this.usersService.findAll();
  }

  @Get(':id')
  profile(@Param('id') id: string) {
    return this.usersService.getProfile(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateUserDto>) {
    const user = await this.usersService.update(id, dto);
    await this.websocketGateway.emitMemberUpdated(user);
    return user;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.usersService.delete(id);
    await this.websocketGateway.emitMemberDeleted(id);
    return { message: 'User deleted successfully' };
  }
}



