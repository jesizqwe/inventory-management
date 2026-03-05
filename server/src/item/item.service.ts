import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item, UserRole } from 'src/generated/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  private async checkAccess(
    itemId: number,
    userId: number,
    userRole: UserRole,
    requireWrite: boolean = false,
  ) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        inventory: { include: { accessList: true } },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (userRole === UserRole.ADMIN) {
      return item;
    }

    if (item.inventory.creatorId === userId) {
      return item;
    }

    if (requireWrite) {
      const hasWriteAccess =
        item.inventory.isPublic ||
        item.inventory.accessList.some((a) => a.userId === userId);

      if (!hasWriteAccess) {
        throw new ForbiddenException('No write access to this item');
      }
    }

    return item;
  }

  private async checkInventoryAccess(
    inventoryId: number,
    userId: number,
    userRole: UserRole,
    requireWrite: boolean = false,
  ) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { accessList: true },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    if (userRole === UserRole.ADMIN) {
      return inventory;
    }

    if (inventory.creatorId === userId) {
      return inventory;
    }

    if (requireWrite) {
      const hasWriteAccess =
        inventory.isPublic ||
        inventory.accessList.some((a) => a.userId === userId);

      if (!hasWriteAccess) {
        throw new ForbiddenException('No write access to this inventory');
      }
    }

    return inventory;
  }

  async findAllByInventory(
    inventoryId: number,
    userId?: number,
    userRole?: UserRole,
  ) {
    await this.checkInventoryAccess(inventoryId, userId || 0, userRole || UserRole.USER);

    return this.prisma.item.findMany({
      where: { inventoryId },
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { comments: true, likes: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: number, userId?: number, userRole?: UserRole) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        inventory: true,
        creator: { select: { id: true, name: true } },
        comments: {
          include: { author: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
        likes: { select: { userId: true } },
        _count: { select: { likes: true } },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  async create(
    inventoryId: number,
    userId: number,
    userRole: UserRole,
    dto: any,
  ) {
    await this.checkInventoryAccess(inventoryId, userId, userRole, true);

    let customId = dto.customId;
    if (!customId) {
      customId = await this.generateCustomId(inventoryId);
    }

    try {
      const item = await this.prisma.item.create({
        data: {
          inventoryId,
          creatorId: userId,
          customId,
          customString1: dto.customString1,
          customString2: dto.customString2,
          customString3: dto.customString3,
          customInt1: dto.customInt1 !== undefined ? parseInt(dto.customInt1) : null,
          customInt2: dto.customInt2 !== undefined ? parseInt(dto.customInt2) : null,
          customInt3: dto.customInt3 !== undefined ? parseInt(dto.customInt3) : null,
          customBool1: dto.customBool1 !== undefined ? Boolean(dto.customBool1) : null,
          customBool2: dto.customBool2 !== undefined ? Boolean(dto.customBool2) : null,
          customBool3: dto.customBool3 !== undefined ? Boolean(dto.customBool3) : null,
        },
      });

      return this.findById(item.id, userId, userRole);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Custom ID already exists in this inventory');
      }
      throw e;
    }
  }

  async update(
    id: number,
    userId: number,
    userRole: UserRole,
    dto: any,
  ) {
    const item = await this.checkAccess(id, userId, userRole, true);

    if (dto.version !== undefined && item.version !== dto.version) {
      throw new ConflictException(
        'Item was modified by another user. Please refresh and try again.',
      );
    }

    try {
      const updateData: any = {
        version: item.version + 1,
      };

      if (dto.customId !== undefined) updateData.customId = dto.customId;
      if (dto.customString1 !== undefined) updateData.customString1 = dto.customString1;
      if (dto.customString2 !== undefined) updateData.customString2 = dto.customString2;
      if (dto.customString3 !== undefined) updateData.customString3 = dto.customString3;
      if (dto.customInt1 !== undefined) updateData.customInt1 = parseInt(dto.customInt1);
      if (dto.customInt2 !== undefined) updateData.customInt2 = parseInt(dto.customInt2);
      if (dto.customInt3 !== undefined) updateData.customInt3 = parseInt(dto.customInt3);
      if (dto.customBool1 !== undefined) updateData.customBool1 = Boolean(dto.customBool1);
      if (dto.customBool2 !== undefined) updateData.customBool2 = Boolean(dto.customBool2);
      if (dto.customBool3 !== undefined) updateData.customBool3 = Boolean(dto.customBool3);

      const updated = await this.prisma.item.update({
        where: { id },
        data: updateData,
      });

      return this.findById(updated.id, userId, userRole);
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('Custom ID already exists in this inventory');
      }
      throw e;
    }
  }

  async delete(id: number, userId: number, userRole: UserRole) {
    await this.checkAccess(id, userId, userRole, true);
    return this.prisma.item.delete({ where: { id } });
  }

  private async generateCustomId(inventoryId: number): Promise<string> {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
      select: { customIdPattern: true },
    });

    if (!inventory?.customIdPattern) {
      const lastItem = await this.prisma.item.findFirst({
        where: { inventoryId },
        orderBy: { id: 'desc' },
        select: { customId: true },
      });

      if (!lastItem?.customId) {
        return '1';
      }

      const lastNum = parseInt(lastItem.customId) || 0;
      return String(lastNum + 1);
    }

    // Simple pattern: replace {seq} with sequence number
    const lastItem = await this.prisma.item.findFirst({
      where: { inventoryId },
      orderBy: { id: 'desc' },
    });
    const seq = (lastItem?.id || 0) + 1;
    
    return inventory.customIdPattern
      .replace('{seq}', String(seq))
      .replace('{date}', new Date().toISOString().slice(0, 10).replace(/-/g, ''))
      .replace('{rand6}', String(Math.floor(Math.random() * 1000000)).padStart(6, '0'));
  }

  async findByUser(userId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where: { creatorId: userId },
        include: { inventory: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.item.count({ where: { creatorId: userId } }),
    ]);

    return { items, total };
  }

  async findWithWriteAccess(userId: number, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const inventories = await this.prisma.inventoryAccess.findMany({
      where: { userId },
      select: { inventoryId: true },
    });

    const inventoryIds = inventories.map((a) => a.inventoryId);

    if (inventoryIds.length === 0) {
      return { items: [], total: 0 };
    }

    const [items, total] = await Promise.all([
      this.prisma.item.findMany({
        where: { inventoryId: { in: inventoryIds } },
        include: { inventory: { select: { id: true, title: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.item.count({ where: { inventoryId: { in: inventoryIds } } }),
    ]);

    return { items, total };
  }
}
