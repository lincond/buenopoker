import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getPlayerRanking(
    @Query('sortBy') sortedBy: string = 'nett',
    @Query('year') year?: number,
  ) {
    const currentYear = year || new Date().getFullYear();

    return {
      ranking: await this.appService.getPlayerRanking(sortedBy, currentYear),
      sortedBy,
      where: { year },
    };
  }
}
