import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { BuyIn } from './entities/buy-in.entity';
import { BuyInService } from './buy-in/buy-in.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Game, BuyIn])
  ],
  controllers: [GameController],
  providers: [GameService, BuyInService],
})
export class GameModule {}
