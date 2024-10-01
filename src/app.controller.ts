import { Controller, Get, Query, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getPlayerRanking(@Query('sortBy') sortByKey: string = 'nett') {
    return { ranking: await this.appService.getPlayerRanking(sortByKey) };
  }
}
