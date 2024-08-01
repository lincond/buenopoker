import { Module } from '@nestjs/common';
import { GameService, BuyInService  } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { BuyIn } from './entities/buy-in.entity';
import { PlayerModule } from 'src/player/player.module';
import { GameController, BuyInController } from './controllers';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, BuyIn]),
    PlayerModule
  ],
  controllers: [GameController, BuyInController],
  providers: [GameService, BuyInService],
})
export class GameModule {}
