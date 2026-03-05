import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findByNamePrefix(prefix: string, limit: number = 10) {
    return this.prisma.tag.findMany({
      where: {
        name: {
          startsWith: prefix,
          mode: 'insensitive',
        },
      },
      take: limit,
      orderBy: { name: 'asc' },
    });
  }

  async create(name: string, creatorId?: number) {
    try {
      return await this.prisma.tag.create({
        data: {
          name,
          creatorId,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Tag already exists');
      }
      throw e;
    }
  }

  async getCloud() {
    const tags = await this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            inventories: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      count: tag._count.inventories,
    }));
  }
}
