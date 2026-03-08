import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
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
  async googleLoginCallback(@Request() req) {
    const result = await this.authService.validateOAuthUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // For production, the callback comes directly to the backend, then we redirect to frontend
    return {
      redirect: `${frontendUrl}/oauth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`,
    };
  }

  @UseGuards(AuthGuard('github'))
  @Get('github')
  githubLogin() {
    // Initiates GitHub OAuth flow
  }

  @UseGuards(AuthGuard('github'))
  @Get('github/callback')
  async githubLoginCallback(@Request() req) {
    const result = await this.authService.validateOAuthUser(req.user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return {
      redirect: `${frontendUrl}/oauth/callback?token=${result.access_token}&user=${encodeURIComponent(JSON.stringify(result.user))}`,
    };
  }
}
