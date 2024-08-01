import { Test, TestingModule } from '@nestjs/testing';
import { CashOut, Game } from './game/entities';
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
      cashOuts: [
        new CashOut({ id: 1, player, chips: 100 }),
        new CashOut({ id: 2, player: player2, chips: 50 }),
      ],
    });

    it('deve retornar o ranking de player', async () => {
      jest.spyOn(gameService, 'findAll').mockResolvedValue([game]);

      const result = await service.getPlayerRanking();
      expect(result).toEqual([
        { player: player.name, sum: 100 },
        { player: player2.name, sum: 50 },
      ]);
    });
  });
});
