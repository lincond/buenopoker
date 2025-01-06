import { Test, TestingModule } from '@nestjs/testing';
import { BuyIn, CashOut, Game } from './game/entities';
import { GameService } from './game/services';
import { AppService } from './app.service';
import { Player } from './player/entities/player.entity';
import { BetweenDatesAdapter } from './common/adapters/between.adapter';

describe('BuyInService', () => {
  let service: AppService;
  let gameService: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: GameService,
          useValue: {
            findByCreatedAtBetween: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    gameService = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(gameService).toBeDefined();
  });

  describe('getPlayerRanking', () => {
    const player = new Player({ id: 1, name: 'Player 1' });
    const player2 = new Player({ id: 2, name: 'Player 2' });
    const game: Game = new Game({
      id: 1,
      buyIns: [
        new BuyIn({ id: 1, player, chips: 200 }),
        new BuyIn({ id: 2, player: player2, chips: 200 }),
      ],
      cashOuts: [
        new CashOut({ id: 1, player, chips: 100 }),
        new CashOut({ id: 2, player: player2, chips: 300 }),
      ],
      createdAt: new Date(),
    });

    it('should return an empty player ranking when the given year does not match any existing game', async () => {
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      jest
        .spyOn(gameService, 'findByCreatedAtBetween')
        .mockImplementation(async function (): Promise<Game[]> {
          const between = new BetweenDatesAdapter(nextYear);
          return [game].filter(({ createdAt }) => between.validate(createdAt));
        });

      const result = await service.getPlayerRanking('nett', nextYear);
      expect(result).toEqual([]);
    });

    it('should return the player ranking ordered by cash-out', async () => {
      const currentYear = new Date().getFullYear();
      jest
        .spyOn(gameService, 'findByCreatedAtBetween')
        .mockResolvedValue([game]);

      const result = await service.getPlayerRanking('cashout', currentYear);
      expect(result).toEqual([
        {
          buyin: 200,
          cashout: 300,
          nett: 100,
          percent: 50,
          player: player2.name,
        },
        {
          buyin: 200,
          cashout: 100,
          nett: -100,
          percent: -50,
          player: player.name,
        },
      ]);
    });

    it('should return the player ranking ordered by buy-in', async () => {
      const currentYear = new Date().getFullYear();
      jest
        .spyOn(gameService, 'findByCreatedAtBetween')
        .mockResolvedValue([game]);

      const result = await service.getPlayerRanking('buyin', currentYear);
      expect(result).toEqual([
        {
          buyin: 200,
          cashout: 100,
          nett: -100,
          percent: -50,
          player: player.name,
        },
        {
          buyin: 200,
          cashout: 300,
          nett: 100,
          percent: 50,
          player: player2.name,
        },
      ]);
    });

    it('should return the player ranking ordered by nett amount', async () => {
      const currentYear = new Date().getFullYear();
      jest
        .spyOn(gameService, 'findByCreatedAtBetween')
        .mockResolvedValue([game]);

      const result = await service.getPlayerRanking('nett', currentYear);
      expect(result).toEqual([
        {
          buyin: 200,
          cashout: 300,
          nett: 100,
          percent: 50,
          player: player2.name,
        },
        {
          buyin: 200,
          cashout: 100,
          nett: -100,
          percent: -50,
          player: player.name,
        },
      ]);
    });

    it('should return the player ranking ordered by nett percentage', async () => {
      const currentYear = new Date().getFullYear();
      jest
        .spyOn(gameService, 'findByCreatedAtBetween')
        .mockResolvedValue([game]);

      const result = await service.getPlayerRanking('percent', currentYear);
      expect(result).toEqual([
        {
          buyin: 200,
          cashout: 300,
          nett: 100,
          percent: 50,
          player: player2.name,
        },
        {
          buyin: 200,
          cashout: 100,
          nett: -100,
          percent: -50,
          player: player.name,
        },
      ]);
    });
  });
});
