import { Controller, Get, Post, Body, Query, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { TagService } from './tag.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  findAll() {
    return this.tagService.findAll();
  }

  @Get('autocomplete')
  autocomplete(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    return this.tagService.findByNamePrefix(
      query,
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('cloud')
  getCloud() {
    return this.tagService.getCloud();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: { name: string }, @Request() req) {
    return this.tagService.create(body.name, req.user.id);
  }
}
