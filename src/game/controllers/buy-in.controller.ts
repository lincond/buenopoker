import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { BuyInService } from '../services';
import { CreateBuyInDto } from '../dto/create-buy-in.dto';
import { Response } from 'express';

@Controller('game/:gameId/buy-in')
export class BuyInController {
  constructor(private readonly buyInService: BuyInService) {}

  @Post()
  async create(
    @Param('gameId', ParseIntPipe) gameId: number,
    @Body() createBuyInDto: CreateBuyInDto,
    @Res() response: Response,
  ) {
    await this.buyInService.create(gameId, createBuyInDto);
    response.redirect(`/game/${gameId}`);
  }
}
