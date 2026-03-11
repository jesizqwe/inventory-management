import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Inventory, InventoryCategory, UserRole } from 'src/generated/client';

interface CustomFieldConfig {
  string1?: { name: string; enabled: boolean };
  string2?: { name: string; enabled: boolean };
  string3?: { name: string; enabled: boolean };
  int1?: { name: string; enabled: boolean };
  int2?: { name: string; enabled: boolean };
  int3?: { name: string; enabled: boolean };
  bool1?: { name: string; enabled: boolean };
  bool2?: { name: string; enabled: boolean };
  bool3?: { name: string; enabled: boolean };
}

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  private async checkAccess(
    inventoryId: number,
    userId: number,
    userRole: UserRole,
    requireWrite: boolean = false,
  ): Promise<Inventory> {
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
      const hasAccess = inventory.accessList.some(
        (access) => access.userId === userId,
      );
      if (!hasAccess && !inventory.isPublic) {
        throw new ForbiddenException('No write access to this inventory');
      }
    }

    return inventory;
  }

  private async checkSettingsAccess(
    inventoryId: number,
    userId: number,
    userRole: UserRole,
  ): Promise<Inventory> {
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

    // Check if user has explicit access (not just isPublic)
    const hasExplicitAccess = inventory.accessList.some(
      (access) => access.userId === userId,
    );

    if (!hasExplicitAccess) {
      throw new ForbiddenException('No access to edit inventory settings');
    }

    return inventory;
  }

  async findAll(query?: {
    search?: string;
    category?: InventoryCategory;
    tag?: string;
    page?: number;
    limit?: number;
  }) {
    const where: any = {};

    if (query?.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query?.category) {
      where.category = query.category;
    }

    if (query?.tag) {
      where.tags = {
        some: {
          tag: {
            name: { contains: query.tag, mode: 'insensitive' },
          },
        },
      };
    }

    const skip = query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit || 20;

    const [inventories, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true, email: true } },
          tags: { include: { tag: true } },
          _count: { select: { items: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.inventory.count({ where }),
    ]);

    return { inventories, total };
  }

  async findById(id: number, userId?: number, userRole?: UserRole) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
        accessList: { include: { user: { select: { id: true, name: true, email: true } } } },
        _count: { select: { items: true } },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    return inventory;
  }

  async create(userId: number, dto: any) {
    const inventory = await this.prisma.inventory.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category || InventoryCategory.OTHER,
        imageUrl: dto.imageUrl,
        isPublic: dto.isPublic || false,
        creatorId: userId,
        // Custom fields config
        customString1Name: dto.customFields?.string1?.name || null,
        customString1State: dto.customFields?.string1?.enabled || false,
        customString1ShowInTable: dto.customFields?.string1?.showInTable || false,
        customString2Name: dto.customFields?.string2?.name || null,
        customString2State: dto.customFields?.string2?.enabled || false,
        customString2ShowInTable: dto.customFields?.string2?.showInTable || false,
        customString3Name: dto.customFields?.string3?.name || null,
        customString3State: dto.customFields?.string3?.enabled || false,
        customString3ShowInTable: dto.customFields?.string3?.showInTable || false,
        customInt1Name: dto.customFields?.int1?.name || null,
        customInt1State: dto.customFields?.int1?.enabled || false,
        customInt1ShowInTable: dto.customFields?.int1?.showInTable || false,
        customInt2Name: dto.customFields?.int2?.name || null,
        customInt2State: dto.customFields?.int2?.enabled || false,
        customInt2ShowInTable: dto.customFields?.int2?.showInTable || false,
        customInt3Name: dto.customFields?.int3?.name || null,
        customInt3State: dto.customFields?.int3?.enabled || false,
        customInt3ShowInTable: dto.customFields?.int3?.showInTable || false,
        customBool1Name: dto.customFields?.bool1?.name || null,
        customBool1State: dto.customFields?.bool1?.enabled || false,
        customBool1ShowInTable: dto.customFields?.bool1?.showInTable || false,
        customBool2Name: dto.customFields?.bool2?.name || null,
        customBool2State: dto.customFields?.bool2?.enabled || false,
        customBool2ShowInTable: dto.customFields?.bool2?.showInTable || false,
        customBool3Name: dto.customFields?.bool3?.name || null,
        customBool3State: dto.customFields?.bool3?.enabled || false,
        customBool3ShowInTable: dto.customFields?.bool3?.showInTable || false,
        customIdPattern: dto.customIdPattern,
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
      },
    });

    if (dto.tagIds && dto.tagIds.length > 0) {
      await this.prisma.inventoryTag.createMany({
        data: dto.tagIds.map((tagId: number) => ({
          inventoryId: inventory.id,
          tagId,
        })),
      });
    }

    return inventory;
  }

  async update(
    id: number,
    userId: number,
    userRole: UserRole,
    dto: any,
  ) {
    await this.checkSettingsAccess(id, userId, userRole);

    const updateData: any = { ...dto };
    delete updateData.tagIds;
    delete updateData.customFields; // Remove nested object, we handle it separately

    // Handle custom fields
    if (dto.customFields) {
      updateData.customString1Name = dto.customFields.string1?.name || null;
      updateData.customString1State = dto.customFields.string1?.enabled || false;
      updateData.customString1ShowInTable = dto.customFields.string1?.showInTable || false;
      updateData.customString2Name = dto.customFields.string2?.name || null;
      updateData.customString2State = dto.customFields.string2?.enabled || false;
      updateData.customString2ShowInTable = dto.customFields.string2?.showInTable || false;
      updateData.customString3Name = dto.customFields.string3?.name || null;
      updateData.customString3State = dto.customFields.string3?.enabled || false;
      updateData.customString3ShowInTable = dto.customFields.string3?.showInTable || false;
      updateData.customInt1Name = dto.customFields.int1?.name || null;
      updateData.customInt1State = dto.customFields.int1?.enabled || false;
      updateData.customInt1ShowInTable = dto.customFields.int1?.showInTable || false;
      updateData.customInt2Name = dto.customFields.int2?.name || null;
      updateData.customInt2State = dto.customFields.int2?.enabled || false;
      updateData.customInt2ShowInTable = dto.customFields.int2?.showInTable || false;
      updateData.customInt3Name = dto.customFields.int3?.name || null;
      updateData.customInt3State = dto.customFields.int3?.enabled || false;
      updateData.customInt3ShowInTable = dto.customFields.int3?.showInTable || false;
      updateData.customBool1Name = dto.customFields.bool1?.name || null;
      updateData.customBool1State = dto.customFields.bool1?.enabled || false;
      updateData.customBool1ShowInTable = dto.customFields.bool1?.showInTable || false;
      updateData.customBool2Name = dto.customFields.bool2?.name || null;
      updateData.customBool2State = dto.customFields.bool2?.enabled || false;
      updateData.customBool2ShowInTable = dto.customFields.bool2?.showInTable || false;
      updateData.customBool3Name = dto.customFields.bool3?.name || null;
      updateData.customBool3State = dto.customFields.bool3?.enabled || false;
      updateData.customBool3ShowInTable = dto.customFields.bool3?.showInTable || false;
    }

    const updated = await this.prisma.inventory.update({
      where: { id },
      data: updateData,
      include: {
        creator: { select: { id: true, name: true, email: true } },
        tags: { include: { tag: true } },
      },
    });

    if (dto.tagIds !== undefined) {
      await this.prisma.inventoryTag.deleteMany({ where: { inventoryId: id } });
      if (dto.tagIds.length > 0) {
        await this.prisma.inventoryTag.createMany({
          data: dto.tagIds.map((tagId: number) => ({
            inventoryId: id,
            tagId,
          })),
        });
      }
    }

    return updated;
  }

  async delete(id: number, userId: number, userRole: UserRole) {
    await this.checkAccess(id, userId, userRole, true);
    return this.prisma.inventory.delete({ where: { id } });
  }

  async addAccess(
    inventoryId: number,
    userId: number,
    userRole: UserRole,
    targetEmail: string,
  ) {
    await this.checkAccess(inventoryId, userId, userRole, true);

    const targetUser = await this.prisma.user.findUnique({
      where: { email: targetEmail },
    });

    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    try {
      await this.prisma.inventoryAccess.create({
        data: {
          inventoryId,
          userId: targetUser.id,
        },
      });
    } catch (e) {
      if (e.code === 'P2002') {
        throw new ConflictException('User already has access');
      }
      throw e;
    }

    return this.findById(inventoryId);
  }

  async removeAccess(
    inventoryId: number,
    userId: number,
    userRole: UserRole,
    targetUserId: number,
  ) {
    await this.checkAccess(inventoryId, userId, userRole, true);

    await this.prisma.inventoryAccess.delete({
      where: {
        userId_inventoryId: {
          userId: targetUserId,
          inventoryId,
        },
      },
    });

    return this.findById(inventoryId);
  }

  async getStatistics(inventoryId: number) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { items: true },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory not found');
    }

    const itemCount = inventory.items.length;
    const stats: any = { itemCount };

    // Stats for enabled custom fields
    const enabledFields: string[] = [];
    if (inventory.customString1State) enabledFields.push('customString1');
    if (inventory.customString2State) enabledFields.push('customString2');
    if (inventory.customString3State) enabledFields.push('customString3');
    if (inventory.customInt1State) enabledFields.push('customInt1');
    if (inventory.customInt2State) enabledFields.push('customInt2');
    if (inventory.customInt3State) enabledFields.push('customInt3');

    enabledFields.forEach((field) => {
      const values = inventory.items.map((item: any) => item[field]);
      const nonNull = values.filter((v) => v !== null && v !== undefined);
      
      if (field.startsWith('customInt')) {
        const nums = nonNull.map((v) => Number(v)).filter((n) => !isNaN(n));
        if (nums.length > 0) {
          stats[field] = {
            min: Math.min(...nums),
            max: Math.max(...nums),
            avg: nums.reduce((a, b) => a + b, 0) / nums.length,
          };
        }
      } else {
        const counts: Record<string, number> = {};
        nonNull.forEach((v: any) => {
          counts[v] = (counts[v] || 0) + 1;
        });
        stats[field] = {
          topValues: Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5),
        };
      }
    });

    return stats;
  }

  async getRecent(limit: number = 5) {
    return this.prisma.inventory.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
    });
  }

  async getTopByItemCount(limit: number = 5) {
    return this.prisma.inventory.findMany({
      take: limit,
      orderBy: { items: { _count: 'desc' } },
      include: {
        creator: { select: { id: true, name: true } },
        _count: { select: { items: true } },
      },
    });
  }

  getCustomFieldConfig(inventory: Inventory): CustomFieldConfig {
    const config: CustomFieldConfig = {};
    
    if (inventory.customString1State) {
      config.string1 = { name: inventory.customString1Name || 'String 1', enabled: true };
    }
    if (inventory.customString2State) {
      config.string2 = { name: inventory.customString2Name || 'String 2', enabled: true };
    }
    if (inventory.customString3State) {
      config.string3 = { name: inventory.customString3Name || 'String 3', enabled: true };
    }
    if (inventory.customInt1State) {
      config.int1 = { name: inventory.customInt1Name || 'Integer 1', enabled: true };
    }
    if (inventory.customInt2State) {
      config.int2 = { name: inventory.customInt2Name || 'Integer 2', enabled: true };
    }
    if (inventory.customInt3State) {
      config.int3 = { name: inventory.customInt3Name || 'Integer 3', enabled: true };
    }
    if (inventory.customBool1State) {
      config.bool1 = { name: inventory.customBool1Name || 'Boolean 1', enabled: true };
    }
    if (inventory.customBool2State) {
      config.bool2 = { name: inventory.customBool2Name || 'Boolean 2', enabled: true };
    }
    if (inventory.customBool3State) {
      config.bool3 = { name: inventory.customBool3Name || 'Boolean 3', enabled: true };
    }

    return config;
  }
}
