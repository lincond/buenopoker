import { Injectable } from '@nestjs/common';
import { GameService } from './game/services';
import { BetweenDatesAdapter } from './common/adapters/between.adapter';

@Injectable()
export class AppService {
  constructor(private readonly gameService: GameService) { }

  async getPlayerRanking(sortByKey: string, year: number) {
    const createdAtBetween = new BetweenDatesAdapter(year);
    const games =
      await this.gameService.findByCreatedAtBetween(createdAtBetween);
    const totalCashOutByPlayerId = new Map<number, number>();
    const totalBuyInByPlayerId = new Map<number, number>();
    const playerNamesByPlayerId = new Map<number, string>();

    for (const game of games) {
      for (const cashOut of game.cashOuts) {
        const playerCashOutSum =
          totalCashOutByPlayerId.get(cashOut.player.id) || 0;
        totalCashOutByPlayerId.set(
          cashOut.player.id,
          playerCashOutSum + cashOut.chips,
        );
        playerNamesByPlayerId.set(cashOut.player.id, cashOut.player.name);
      }

      for (const buyIn of game.buyIns) {
        const playerBuyInSum = totalBuyInByPlayerId.get(buyIn.player.id) || 0;
        totalBuyInByPlayerId.set(buyIn.player.id, playerBuyInSum + buyIn.chips);
      }
    }

    return Array.from(playerNamesByPlayerId.entries())
      .map(([playerId, player]) => {
        const buyin = totalBuyInByPlayerId.get(playerId);
        const cashout = totalCashOutByPlayerId.get(playerId);
        const nett = cashout - buyin;
        const percent = buyin > 0 ? (nett / buyin) * 100 : 0;

        return { player, buyin, cashout, nett, percent };
      })
      .sort((a, b) => b[sortByKey] - a[sortByKey]);
  }
}
