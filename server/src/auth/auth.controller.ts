import { Controller, Post, Body, UseGuards, Request, Get, Res, Redirect } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(
      createUserDto.email,
      createUserDto.name,
      createUserDto.password,
    );
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard('google'))
  @Get('google')
  googleLogin() {
    // Initiates Google OAuth flow
  }

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @Redirect()
  async googleLoginCallback(@Request() req, @Res() res: Response) {
    const result = await this.authService.validateOAuthUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/oauth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    return { url: redirectUrl };
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  githubLogin() {
    // Initiates GitHub OAuth flow
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  @Redirect()
  async githubLoginCallback(@Request() req, @Res() res: Response) {
    const result = await this.authService.validateOAuthUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/oauth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`;
    return { url: redirectUrl };
  }
}
