import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('cleaning-platforms')
  async getCleaningPlatforms() {
    return await this.searchService.searchCleaningPlatforms();
  }

  @Get('renovation-platforms')
  async getRenovationPlatforms() {
    return await this.searchService.searchRenovationPlatforms();
  }

  @Get('all-platforms')
  async getAllPlatforms() {
    const [cleaning, renovation] = await Promise.all([
      this.searchService.searchCleaningPlatforms(),
      this.searchService.searchRenovationPlatforms()
    ]);

    return {
      status: 'success',
      data: {
        cleaning,
        renovation
      }
    };
  }
}
