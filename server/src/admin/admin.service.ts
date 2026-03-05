import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, UserRole } from 'src/generated/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(): Promise<User[]> {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async blockUser(id: number): Promise<User> {
    const user = await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isBlocked: true },
    });
  }

  async unblockUser(id: number): Promise<User> {
    const user = await this.findUserById(id);
    return this.prisma.user.update({
      where: { id },
      data: { isBlocked: false },
    });
  }

  async addToAdminRole(id: number): Promise<User> {
    const user = await this.findUserById(id);
    if (user.role === UserRole.ADMIN) {
      throw new ConflictException('User is already an admin');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role: UserRole.ADMIN },
    });
  }

  async removeFromAdminRole(id: number): Promise<User> {
    const user = await this.findUserById(id);
    if (user.role === UserRole.USER) {
      throw new ConflictException('User is not an admin');
    }
    return this.prisma.user.update({
      where: { id },
      data: { role: UserRole.USER },
    });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.findUserById(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
