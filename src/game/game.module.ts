import { Module } from '@nestjs/common';
import { GameService, BuyInService, CashOutService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from 'src/player/player.module';
import {
  GameController,
  BuyInController,
  CashOutController,
} from './controllers';
import { Game, BuyIn, CashOut } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Game, BuyIn, CashOut]), PlayerModule],
  controllers: [GameController, BuyInController, CashOutController],
  providers: [GameService, BuyInService, CashOutService],
  exports: [GameService],
})
export class GameModule {}
