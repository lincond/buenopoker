import { Injectable } from '@nestjs/common';
import { GameService } from './game/services';
import { Player } from './player/entities/player.entity';

@Injectable()
export class AppService {
  constructor(private readonly gameSerivce: GameService) {}

  async getPlayerRanking() {
    const games = await this.gameSerivce.findAll();
    const playersCashOutSum = new Map<number, number>();
    const playersNames = new Map<number, string>();

    for (const game of games) {
      for (const cashOut of game.cashOuts) {
        const playerCashOutSum = playersCashOutSum.get(cashOut.player.id) || 0;
        playersCashOutSum.set(
          cashOut.player.id,
          playerCashOutSum + cashOut.chips,
        );
        playersNames.set(cashOut.player.id, cashOut.player.name);
      }
    }

    return Array.from(playersCashOutSum.entries())
      .map(([playerId, sum]) => ({ player: playersNames.get(playerId), sum }))
      .sort((a, b) => b.sum - a.sum);
  }
}
