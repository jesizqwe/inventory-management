import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto, UpdateInventoryDto, AddAccessDto, RemoveAccessDto } from './dto/inventory.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InventoryCategory } from 'src/generated/client';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('category') category?: InventoryCategory,
    @Query('tag') tag?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.inventoryService.findAll({
      search,
      category,
      tag,
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
    });
  }

  @Get('recent')
  getRecent(@Query('limit') limit?: string) {
    return this.inventoryService.getRecent(limit ? parseInt(limit) : 5);
  }

  @Get('top')
  getTop(@Query('limit') limit?: string) {
    return this.inventoryService.getTopByItemCount(limit ? parseInt(limit) : 5);
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    const userId = req.user?.id;
    const userRole = req.user?.role;
    return this.inventoryService.findById(id, userId, userRole);
  }

  @Get(':id/statistics')
  getStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.getStatistics(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req, @Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(req.user.id, dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: UpdateInventoryDto,
  ) {
    return this.inventoryService.update(id, req.user.id, req.user.role, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.inventoryService.delete(id, req.user.id, req.user.role);
  }

  @Post(':id/access')
  @UseGuards(JwtAuthGuard)
  addAccess(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: AddAccessDto,
  ) {
    return this.inventoryService.addAccess(id, req.user.id, req.user.role, dto.email);
  }

  @Delete(':id/access/:userId')
  @UseGuards(JwtAuthGuard)
  removeAccess(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Request() req,
  ) {
    return this.inventoryService.removeAccess(id, req.user.id, req.user.role, userId);
  }
}
