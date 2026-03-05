import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: 'all' | 'inventories' | 'items',
    @Query('tag') tag?: string,
  ) {
    return this.searchService.search(query, {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      type,
      tag,
    });
  }

  @Get('inventory/:inventoryId')
  searchInInventory(
    @Param('inventoryId', ParseIntPipe) inventoryId: number,
    @Query('q') query: string,
  ) {
    return this.searchService.searchInInventory(inventoryId, query);
  }
}
