import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from '../services';
import { PlayerService } from '../../player/player.service';
import { BuyIn, CashOut, Game } from '../entities';
import { Player } from '../../player/entities/player.entity';

describe('GameController', () => {
  let controller: GameController;
  let service: GameService;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        {
          provide: GameService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    service = module.get<GameService>(GameService);
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
    expect(playerService).toBeDefined();
  });

  const dto = { dolar: 550, royalFlushFee: 2, pixName: 'pixName', pixKey: 'pixKey' };
  const gameId = 1;
  const player = new Player({ id: 1 });
  const player2 = new Player({ id: 2 });
  const buyIns = [
    new BuyIn({ id: 1, player, chips: 100 }),
    new BuyIn({ id: 2, player, chips: 100 }),
    new BuyIn({ id: 3, player: player2, chips: 100 }),
  ];
  const cashOuts = [
    new CashOut({ id: 1, player, chips: 50 }),
    new CashOut({ id: 2, player, chips: 50 }),
  ];
  const game = new Game({ id: gameId, buyIns, cashOuts });
  const response = {
    redirect: jest.fn(),
  } as unknown as any;

  describe('create', () => {
    it('deve criar um jogo', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(game);

      await controller.create(dto, response);

      expect(service.create).toHaveBeenCalledWith(dto);
      expect(response.redirect).toHaveBeenCalledWith(`/game/${game.id}`);
    });
  });

  describe('findAll', () => {
    it('should return a list of games', async () => {
      const games = [game];
      jest.spyOn(service, 'findAll').mockResolvedValue(games);

      expect(await controller.findAll()).toEqual({ games });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um jogo pelo id', async () => {
      const gamePlayers = [
        { id: 1, chips: 100 },
        { id: 2, chips: 100 },
      ];
      jest.spyOn(service, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findAll').mockResolvedValue([player]);

      expect(await controller.findOne(gameId)).toEqual({
        game,
        gamePlayers,
        allPlayers: [player],
      });
      expect(service.findOne).toHaveBeenCalledWith(gameId);
      expect(playerService.findAll).toHaveBeenCalled();
    });
  });
});
