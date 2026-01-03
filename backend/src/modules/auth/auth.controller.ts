import { Body, Controller, Post, Get, Req, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.validateCredentials(dto);
  }

  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {
    // Initiates Google OAuth flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const result = await this.authService.handleOAuthLogin(user);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`);
  }

  @Get('apple')
  @UseGuards(AuthGuard('apple'))
  appleAuth() {
    // Initiates Apple OAuth flow
  }

  @Get('apple/callback')
  @UseGuards(AuthGuard('apple'))
  async appleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as any;
    const result = await this.authService.handleOAuthLogin(user);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/auth/callback?token=${result.token}&user=${encodeURIComponent(JSON.stringify(result.user))}`);
  }

  @Post('oauth/mobile')
  async mobileOAuth(@Body() body: { provider: 'google' | 'apple'; token: string; email?: string; name?: string; picture?: string }) {
    return this.authService.handleMobileOAuth(body);
  }
}



