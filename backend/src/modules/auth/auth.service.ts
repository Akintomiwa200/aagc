import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async validateCredentials({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const { password: _, ...safe } = user.toObject();
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
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
        role: 'member',
      });
    } else {
      // Update existing user with OAuth info if needed
      if (oauthUser.picture && !user.avatar) {
        await this.usersService.update(user._id.toString(), { avatar: oauthUser.picture });
      }
    }

    const { password: _, ...safe } = user.toObject();
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: safe,
    };
  }

  async handleMobileOAuth(data: { provider: 'google' | 'apple'; token: string; email?: string; name?: string; picture?: string }) {
    // For mobile, we receive the OAuth token from the client
    // In production, verify the token with Google/Apple

    if (data.provider === 'google') {
      try {
        // Verify token with Google API
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (!response.ok) {
          // Try verifying as ID Token if access token fails
          const idTokenResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${data.token}`);
          if (!idTokenResponse.ok) {
            throw new UnauthorizedException('Invalid Google token');
          }
          const idTokenData = await idTokenResponse.json();
          const emailVerified = idTokenData.email_verified === true || idTokenData.email_verified === 'true';

          if (!idTokenData.email || !emailVerified) {
            throw new UnauthorizedException('Google account email is not verified');
          }

          data.email = idTokenData.email;
          data.name = idTokenData.name;
          data.picture = idTokenData.picture;
        } else {
          const userData = await response.json();
          const emailVerified = userData.email_verified !== false;

          if (!userData.email || !emailVerified) {
            throw new UnauthorizedException('Google account email is not verified');
          }

          data.email = userData.email;
          data.name = userData.name || userData.given_name;
          data.picture = userData.picture;
        }
      } catch (error) {
        console.error('Google token verification failed:', error);
        throw new UnauthorizedException('Google authentication failed');
      }
    }

    let user = await this.usersService.findByEmail(data.email || '');

    if (!user && data.email) {
      user = await this.usersService.create({
        email: data.email,
        name: data.name || 'User',
        password: '', // OAuth users don't need password
        avatar: data.picture,
        provider: data.provider,
        role: 'member',
      });
    }

    if (!user) {
      throw new UnauthorizedException('Unable to authenticate');
    }

    const { password: _, ...safe } = user.toObject();
    const payload = { sub: user._id, email: user.email, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      user: safe,
    };
  }
}



