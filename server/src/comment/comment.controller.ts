import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('inventory/:inventoryId')
  findByInventory(@Param('inventoryId', ParseIntPipe) id: number) {
    return this.commentService.findByInventory(id);
  }

  @Get('item/:itemId')
  findByItem(@Param('itemId', ParseIntPipe) id: number) {
    return this.commentService.findByItem(id);
  }

  @Post('inventory/:inventoryId')
  @UseGuards(JwtAuthGuard)
  createForInventory(
    @Param('inventoryId', ParseIntPipe) id: number,
    @Body() body: { text: string },
    @Request() req,
  ) {
    return this.commentService.createForInventory(id, req.user.id, body.text);
  }

  @Post('item/:itemId')
  @UseGuards(JwtAuthGuard)
  createForItem(
    @Param('itemId', ParseIntPipe) id: number,
    @Body() body: { text: string },
    @Request() req,
  ) {
    return this.commentService.createForItem(id, req.user.id, body.text);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.commentService.delete(id, req.user.id, req.user.role);
  }
}
