import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { BuyIn } from './entities/buy-in.entity';
import { BuyInService } from './buy-in/buy-in.service';
import { PlayerModule } from 'src/player/player.module';
import { BuyInController } from './buy-in/buy-in.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, BuyIn]),
    PlayerModule
  ],
  controllers: [GameController, BuyInController],
  providers: [GameService, BuyInService],
})
export class GameModule {}
