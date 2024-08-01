import { Body, Controller, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { CashOutService } from '../services';
import { CreateCashOutDto } from '../dto/create-cash-out.dto';
import { Response } from 'express';

@Controller('game/:gameId/cash-out')
export class CashOutController {
  constructor(private readonly cashOutService: CashOutService) {}

  @Post()
  async create(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() createCashOutDto: CreateCashOutDto,
    @Res() response: Response
  ) {
    await this.cashOutService.create(gameId, createCashOutDto)
    response.redirect(`/game/${gameId}`)
  }
}

