import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return null;
    }
    if (user.isBlocked) {
      throw new UnauthorizedException('User is blocked');
    }
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(email: string, name: string, password: string) {
    const existingEmail = await this.prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      throw new ConflictException('Email already exists.');
    }
    const existingName = await this.prisma.user.findUnique({ where: { name } });
    if (existingName) {
      throw new ConflictException('Username already exists.');
    }
    const salt = 10;
    const passwordHash = await bcrypt.hash(password, salt);
    const user = await this.prisma.user.create({
      data: { email, name, passwordHash },
    });
    return this.login(user);
  }

  async validateOAuthUser(providerData: {
    providerId: string;
    email: string;
    name: string;
    provider: string;
  }) {
    // Check if user exists by provider
    let user = await this.prisma.user.findFirst({
      where: {
        providerId: providerData.providerId,
        provider: providerData.provider,
      },
    });

    if (user) {
      if (user.isBlocked) {
        throw new UnauthorizedException('User is blocked');
      }
      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }

    // Check if email already exists
    user = await this.prisma.user.findUnique({ where: { email: providerData.email } });
    if (user) {
      // Link provider to existing account
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          providerId: providerData.providerId,
          provider: providerData.provider,
        },
      });
      if (user.isBlocked) {
        throw new UnauthorizedException('User is blocked');
      }
      const payload = { sub: user.id, email: user.email, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }

    // Create new user
    let uniqueName = providerData.name;
    let counter = 1;
    while (await this.prisma.user.findUnique({ where: { name: uniqueName } })) {
      uniqueName = `${providerData.name}${counter}`;
      counter++;
    }

    user = await this.prisma.user.create({
      data: {
        email: providerData.email,
        name: uniqueName,
        providerId: providerData.providerId,
        provider: providerData.provider,
      },
    });

    const payload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
