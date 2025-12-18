import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('APPLE_CLIENT_ID') || 'your-apple-client-id',
      teamID: configService.get('APPLE_TEAM_ID') || 'your-apple-team-id',
      keyID: configService.get('APPLE_KEY_ID') || 'your-apple-key-id',
      privateKeyLocation: configService.get('APPLE_PRIVATE_KEY_PATH'),
      callbackURL: configService.get('APPLE_CALLBACK_URL') || 'http://localhost:3001/api/auth/apple/callback',
      scope: ['name', 'email'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    const user = {
      email: profile.email,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      picture: null,
      accessToken,
      provider: 'apple',
      sub: profile.sub,
    };
    done(null, user);
  }
}

