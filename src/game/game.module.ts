import { Module } from '@nestjs/common';
import { GameService, BuyInService  } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayerModule } from 'src/player/player.module';
import { GameController, BuyInController } from './controllers';
import { Game, BuyIn, CashOut } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, BuyIn, CashOut]),
    PlayerModule
  ],
  controllers: [GameController, BuyInController],
  providers: [GameService, BuyInService],
})
export class GameModule {}
