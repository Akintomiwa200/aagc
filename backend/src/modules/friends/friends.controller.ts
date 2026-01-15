import { Controller, Get, Post, Put, Body, Param, Query, Inject, forwardRef } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AppGateway } from '../websocket/websocket.gateway';

@Controller('friends')
export class FriendsController {
    constructor(
        private readonly friendsService: FriendsService,
        @Inject(forwardRef(() => AppGateway))
        private readonly appGateway: AppGateway,
    ) { }

    @Post('request')
    async sendRequest(@Body() dto: { userId: string }, @Query('requesterId') requesterId: string) {
        const request = await this.friendsService.sendRequest(requesterId, dto.userId);
        // We could emit a 'friend-request-sent' but let's just use notification if implemented
        return request;
    }

    @Get('requests')
    async getRequests(@Query('userId') userId: string) {
        return this.friendsService.getRequests(userId);
    }

    @Put('requests/:requestId')
    async respondToRequest(@Param('requestId') requestId: string, @Body() dto: { status: 'accepted' | 'rejected' }) {
        const request = await this.friendsService.respondToRequest(requestId, dto.status);
        if (dto.status === 'accepted') {
            // Emit member updated so friends list refreshes
            this.appGateway.emitMemberUpdated({ id: request.requesterId });
            this.appGateway.emitMemberUpdated({ id: request.recipientId });
        }
        return request;
    }

    @Get()
    async getFriends(@Query('userId') userId: string) {
        return this.friendsService.getFriends(userId);
    }
}
