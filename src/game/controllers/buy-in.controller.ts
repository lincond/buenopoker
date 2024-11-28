import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { BuyInService } from '../services';
import { CreateBuyInDto } from '../dto/create-buy-in.dto';
import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('game/:gameId/buy-in')
@UseGuards(AuthGuard)
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
