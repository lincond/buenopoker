import { Controller, Get, Query, Render, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  async getPlayerRanking(@Query('sortBy') sortedBy: string = 'nett') {
    return {
      ranking: await this.appService.getPlayerRanking(sortedBy),
      sortedBy,
    };
  }
}
