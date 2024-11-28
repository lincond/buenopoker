import { Module } from '@nestjs/common';
import { GameService, BuyInService, CashOutService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from 'src/player/player.module';
import {
  GameController,
  BuyInController,
  CashOutController,
} from './controllers';
import { Game, BuyIn, CashOut, Pix } from './entities';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, BuyIn, CashOut, Pix]),
    PlayerModule,
    AuthModule,
  ],
  controllers: [GameController, BuyInController, CashOutController],
  providers: [GameService, BuyInService, CashOutService],
  exports: [GameService],
})
export class GameModule {}
