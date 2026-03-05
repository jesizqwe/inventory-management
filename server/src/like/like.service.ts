import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikeService {
  constructor(private prisma: PrismaService) {}

  async toggleLike(itemId: number, userId: number) {
    const existing = await this.prisma.like.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (existing) {
      await this.prisma.like.delete({
        where: { id: existing.id },
      });
      return { liked: false };
    } else {
      await this.prisma.like.create({
        data: {
          userId,
          itemId,
        },
      });
      return { liked: true };
    }
  }

  async getLikeCount(itemId: number) {
    const count = await this.prisma.like.count({
      where: { itemId },
    });
    return { count };
  }

  async getUserLike(itemId: number, userId: number) {
    const like = await this.prisma.like.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });
    return { liked: !!like };
  }
}
