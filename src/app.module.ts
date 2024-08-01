import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerModule } from './player/player.module';
import { Player } from './player/entities/player.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { BuyIn } from './game/entities/buy-in.entity';
import { Game } from './game/entities/game.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db/sql',
      synchronize: true,
      entities: [Player, BuyIn, Game],
    }),
    PlayerModule,
    GameModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
