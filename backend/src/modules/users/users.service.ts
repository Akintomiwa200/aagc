import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  async create(dto: CreateUserDto) {
    const userData: any = { ...dto };

    // Only hash password if provided (OAuth users don't have passwords)
    if (dto.password) {
      userData.password = await bcrypt.hash(dto.password, 10);
    }

    // Set name from fullName or name field
    if (dto.fullName) {
      userData.name = dto.fullName;
    } else if (dto.name) {
      userData.name = dto.name;
    }

    const created = new this.userModel(userData);
    return created.save();
  }

  async findAll() {
    return this.userModel.find().select('-password').lean();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async getProfile(id: string) {
    const user = await this.userModel.findById(id).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, updates: Partial<CreateUserDto>) {
    const user = await this.userModel.findByIdAndUpdate(id, updates, { new: true }).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updatePushToken(id: string, pushToken: string) {
    const user = await this.userModel.findByIdAndUpdate(id, { pushToken }, { new: true }).select('-password').lean();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async delete(id: string) {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }

  async changePassword(id: string, oldPassword?: string, newPassword?: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (user.password && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) throw new BadRequestException('Invalid old password');
    }

    if (newPassword) {
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
    }

    return { message: 'Password updated successfully' };
  }
}



