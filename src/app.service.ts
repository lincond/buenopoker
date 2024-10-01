import { Injectable } from '@nestjs/common';
import { GameService } from './game/services';

@Injectable()
export class AppService {
  constructor(private readonly gameSerivce: GameService) { }

  async getPlayerRanking(sortByKey: string) {
    const games = await this.gameSerivce.findAll();
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
