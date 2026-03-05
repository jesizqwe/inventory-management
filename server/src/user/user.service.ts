import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from 'src/generated/client';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<User[]> {
        return this.prisma.user.findMany()
    }

    async findById(id: number): Promise<User> {
        const user = await this.prisma.user.findUnique({ where: { id } })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        return user
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async updateProfile(id: number, data: { name?: string; avatarUrl?: string }): Promise<User> {
        return this.prisma.user.update({
            where: { id },
            data,
        });
    }
}
