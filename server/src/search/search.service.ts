import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, options?: {
    page?: number;
    limit?: number;
    type?: 'all' | 'inventories' | 'items';
    tag?: string;
  }) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const type = options?.type || 'all';
    const tag = options?.tag;
    const skip = (page - 1) * limit;

    const results: any = {};

    // Build where clauses
    const inventoryWhere: any = {};
    const itemWhere: any = {};

    if (query) {
      inventoryWhere.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ];
      itemWhere.OR = [
        { customId: { contains: query, mode: 'insensitive' } },
        { customString1: { contains: query, mode: 'insensitive' } },
        { customString2: { contains: query, mode: 'insensitive' } },
        { customString3: { contains: query, mode: 'insensitive' } },
      ];
    }

    if (tag) {
      inventoryWhere.tags = {
        some: {
          tag: {
            name: {
              equals: tag,
              mode: 'insensitive',
            },
          },
        },
      };
      // Also filter items by tag through inventory
      itemWhere.inventory = {
        tags: {
          some: {
            tag: {
              name: {
                equals: tag,
                mode: 'insensitive',
              },
            },
          },
        },
      };
    }

    if (type === 'all' || type === 'inventories') {
      const [inventories, inventoriesTotal] = await Promise.all([
        this.prisma.inventory.findMany({
          where: Object.keys(inventoryWhere).length > 0 ? inventoryWhere : undefined,
          include: {
            creator: { select: { id: true, name: true } },
            tags: { include: { tag: true } },
            _count: { select: { items: true } },
          },
          orderBy: { updatedAt: 'desc' },
          skip: type === 'all' ? undefined : skip,
          take: type === 'all' ? undefined : limit,
        }),
        this.prisma.inventory.count({
          where: Object.keys(inventoryWhere).length > 0 ? inventoryWhere : undefined,
        }),
      ]);

      results.inventories = {
        items: inventories,
        total: inventoriesTotal,
      };
    }

    if (type === 'all' || type === 'items') {
      const [items, itemsTotal] = await Promise.all([
        this.prisma.item.findMany({
          where: Object.keys(itemWhere).length > 0 ? itemWhere : undefined,
          include: {
            inventory: {
              include: {
                tags: { include: { tag: true } },
              },
            },
            creator: { select: { id: true, name: true } },
            _count: { select: { comments: true, likes: true } },
          },
          orderBy: { updatedAt: 'desc' },
          skip: type === 'all' ? undefined : skip,
          take: type === 'all' ? undefined : limit,
        }),
        this.prisma.item.count({
          where: Object.keys(itemWhere).length > 0 ? itemWhere : undefined,
        }),
      ]);

      results.items = {
        items,
        total: itemsTotal,
      };
    }

    return results;
  }

  async searchInInventory(inventoryId: number, query: string) {
    const items = await this.prisma.item.findMany({
      where: {
        inventoryId,
        OR: [
          { customId: { contains: query, mode: 'insensitive' } },
          { customString1: { contains: query, mode: 'insensitive' } },
          { customString2: { contains: query, mode: 'insensitive' } },
          { customString3: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        creator: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }
}
