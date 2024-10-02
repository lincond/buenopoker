import { Test, TestingModule } from '@nestjs/testing';
import { BuyIn, CashOut, Game } from './game/entities';
import { GameService } from './game/services';
import { AppService } from './app.service';
import { Player } from './player/entities/player.entity';

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
            findAll: jest.fn(),
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
    });

    it('deve retornar o ranking de players ordenado pelo cashout', async () => {
      jest.spyOn(gameService, 'findAll').mockResolvedValue([game]);

      const result = await service.getPlayerRanking('cashout');
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

    it('deve retornar o ranking de players ordenado pelo buyin', async () => {
      jest.spyOn(gameService, 'findAll').mockResolvedValue([game]);

      const result = await service.getPlayerRanking('buyin');
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

    it('deve retornar o ranking de players ordenado pelo valor líquido', async () => {
      jest.spyOn(gameService, 'findAll').mockResolvedValue([game]);

      const result = await service.getPlayerRanking('nett');
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

    it('deve retornar o ranking de players ordenado pelo percentual líquido', async () => {
      jest.spyOn(gameService, 'findAll').mockResolvedValue([game]);

      const result = await service.getPlayerRanking('percent');
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
