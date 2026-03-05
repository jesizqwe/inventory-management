import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto, UpdateItemDto } from './dto/item.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('inventory/:inventoryId')
  findAllByInventory(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Request() req,
  ) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.itemService.findAllByInventory(inventoryId, userId, userRole);
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.itemService.findById(id, userId, userRole);
  }

  @Post('inventory/:inventoryId')
  @UseGuards(JwtAuthGuard)
  create(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Request() req,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemService.create(inventoryId, req.user.id, req.user.role, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemService.update(id, req.user.id, req.user.role, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.itemService.delete(id, req.user.id, req.user.role);
  }

  @Get('user/:userId/owned')
  findOwnedByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.itemService.findByUser(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('user/:userId/write-access')
  findWithWriteAccess(
    @Param('userId', ParseIntPipe) userId: number,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.itemService.findWithWriteAccess(
      userId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 20,
    );
  }
}
