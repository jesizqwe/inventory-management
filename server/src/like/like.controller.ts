import { Controller, Get, Post, Param, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('item/:itemId')
  @UseGuards(JwtAuthGuard)
  toggleLike(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Request() req,
  ) {
    return this.likeService.toggleLike(itemId, req.user.id);
  }

  @Get('item/:itemId/count')
  getLikeCount(@Param('itemId', ParseIntPipe) itemId: number) {
    return this.likeService.getLikeCount(itemId);
  }

  @Get('item/:itemId/status')
  @UseGuards(JwtAuthGuard)
  getUserLike(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Request() req,
  ) {
    return this.likeService.getUserLike(itemId, req.user.id);
  }
}
