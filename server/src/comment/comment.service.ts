import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserRole } from 'src/generated/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async findByInventory(inventoryId: number) {
    return this.prisma.comment.findMany({
      where: { inventoryId },
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByItem(itemId: number) {
    return this.prisma.comment.findMany({
      where: { itemId },
      include: {
        author: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createForInventory(
    inventoryId: number,
    userId: number,
    text: string,
  ) {
    const comment = await this.prisma.comment.create({
      data: {
        text,
        authorId: userId,
        inventoryId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return comment;
  }

  async createForItem(itemId: number, userId: number, text: string) {
    const comment = await this.prisma.comment.create({
      data: {
        text,
        authorId: userId,
        itemId,
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    return comment;
  }

  async delete(id: number, userId: number, userRole: UserRole) {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Only author or admin can delete
    if (comment.authorId !== userId && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Cannot delete this comment');
    }

    return this.prisma.comment.delete({ where: { id } });
  }
}
