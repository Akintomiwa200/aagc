import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FriendRequest, FriendRequestDocument } from './schemas/friend-request.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(FriendRequest.name) private friendRequestModel: Model<FriendRequestDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
    ) { }

    async sendRequest(requesterId: string, recipientId: string) {
        if (requesterId === recipientId) throw new BadRequestException('Cannot add yourself');

        // Check if already friends or request pending
        const existing = await this.friendRequestModel.findOne({
            $or: [
                { requesterId, recipientId },
                { requesterId: recipientId, recipientId: requesterId }
            ]
        });

        if (existing) throw new BadRequestException('Request already exists or already friends');

        const request = new this.friendRequestModel({
            requesterId: new Types.ObjectId(requesterId),
            recipientId: new Types.ObjectId(recipientId),
        });
        return request.save();
    }

    async getRequests(userId: string) {
        return this.friendRequestModel.find({ recipientId: userId, status: 'pending' })
            .populate('requesterId', 'name email avatar')
            .lean();
    }

    async respondToRequest(requestId: string, status: 'accepted' | 'rejected') {
        const request = await this.friendRequestModel.findById(requestId);
        if (!request) throw new NotFoundException('Request not found');

        request.status = status;
        await request.save();

        if (status === 'accepted') {
            // Add to friends list in User model (assuming friends field exists)
            await this.userModel.findByIdAndUpdate(request.requesterId, { $addToSet: { friends: request.recipientId } });
            await this.userModel.findByIdAndUpdate(request.recipientId, { $addToSet: { friends: request.requesterId } });
        }

        return request;
    }

    async getFriends(userId: string) {
        const user = await this.userModel.findById(userId).populate('friends', 'name email avatar').lean();
        return user?.friends || [];
    }
}
