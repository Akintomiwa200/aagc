import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateCredentials({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...safe } = user.toObject();
    return {
      token: 'demo-admin-token', // placeholder; swap with JWT later
      user: safe,
    };
  }

  async handleOAuthLogin(oauthUser: any) {
    let user = await this.usersService.findByEmail(oauthUser.email);
    
    if (!user) {
      // Create new user from OAuth
      user = await this.usersService.create({
        email: oauthUser.email,
        name: `${oauthUser.firstName} ${oauthUser.lastName}`.trim(),
        password: '', // OAuth users don't need password
        avatar: oauthUser.picture,
        provider: oauthUser.provider,
      });
    } else {
      // Update existing user with OAuth info if needed
      if (oauthUser.picture && !user.avatar) {
        await this.usersService.update(user._id.toString(), { avatar: oauthUser.picture });
      }
    }

    const { password: _, ...safe } = user.toObject();
    return {
      token: 'demo-oauth-token', // In production, generate JWT
      user: safe,
    };
  }

  async handleMobileOAuth(data: { provider: 'google' | 'apple'; token: string; email?: string; name?: string; picture?: string }) {
    // For mobile, we receive the OAuth token from the client
    // In production, verify the token with Google/Apple
    // For now, we'll use the provided data
    
    let user = await this.usersService.findByEmail(data.email || '');
    
    if (!user && data.email) {
      user = await this.usersService.create({
        email: data.email,
        name: data.name || 'User',
        password: '', // OAuth users don't need password
        avatar: data.picture,
        provider: data.provider,
      });
    }

    if (!user) {
      throw new UnauthorizedException('Unable to authenticate');
    }

    const { password: _, ...safe } = user.toObject();
    return {
      token: 'demo-mobile-oauth-token',
      user: safe,
    };
  }
}



