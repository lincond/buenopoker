import { Test, TestingModule } from '@nestjs/testing';
import { CashOutService } from './cash-out.service';
import { Repository } from 'typeorm';
import { BuyIn, CashOut, Game } from '../entities';
import { PlayerService } from '../../player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../player/entities/player.entity';

describe('CashOutService', () => {
  let service: CashOutService;
  let repository: Repository<CashOut>;
  let gameRepository: Repository<Game>;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CashOutService,
        {
          provide: getRepositoryToken(CashOut),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Game),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: PlayerService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CashOutService>(CashOutService);
    repository = module.get<Repository<CashOut>>(getRepositoryToken(CashOut));
    gameRepository = module.get<Repository<Game>>(getRepositoryToken(Game));
    playerService = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
    expect(gameRepository).toBeDefined();
    expect(playerService).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um cash-out', async () => {
      const dto = { playerId: 1, chips: 100 };
      const gameId = 1;
      const player = new Player({ id: 1 });
      const game = new Game({
        id: gameId,
        buyIns: [new BuyIn({ id: 1, player, chips: 100 })],
        cashOuts: [],
      });
      const cashOut = new CashOut({ id: 1, game, player, chips: 100 });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(player);
      jest.spyOn(repository, 'save').mockResolvedValue(cashOut);

      expect(await service.create(gameId, dto)).toEqual(cashOut);
      expect(gameRepository.findOne).toHaveBeenCalledWith({
        relations: { buyIns: { player: true }, cashOuts: { player: true } },
        where: { id: gameId },
      });
      expect(playerService.findOne).toHaveBeenCalledWith(player.id);
      expect(repository.save).toHaveBeenCalledWith({
        game,
        player,
        chips: dto.chips,
      });
    });

    it('deve lançar um erro se o jogo não for encontrado', async () => {
      const dto = { playerId: 1, chips: 100 };
      const gameId = 1;

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.create(gameId, dto)).rejects.toThrowError(
        'Jogo não encontrado',
      );
      expect(gameRepository.findOne).toHaveBeenCalledWith({
        where: { id: gameId },
        relations: {
          buyIns: {
            player: true,
          },
          cashOuts: {
            player: true,
          },
        },
      });
    });

    it('deve lançar um erro se o jogador não estiver no jogo', async () => {
      const dto = { playerId: 1, chips: 100 };
      const gameId = 1;
      const game = new Game({
        id: gameId,
        buyIns: [],
        cashOuts: [],
      });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);

      await expect(service.create(gameId, dto)).rejects.toThrowError(
        'Jogador inválido',
      );
    });

    it('deve lançar um erro se o jogador não tiver feito buyIn', async () => {
      const dto = { playerId: 1, chips: 100 };
      const gameId = 1;
      const player = new Player({ id: 2 });
      const game = new Game({
        id: gameId,
        buyIns: [new BuyIn({ id: 1, player, chips: 100 })],
        cashOuts: [],
      });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(player);

      await expect(service.create(gameId, dto)).rejects.toThrowError(
        'O jogador não está no jogo',
      );
      expect(gameRepository.findOne).toHaveBeenCalled();
      expect(playerService.findOne).toHaveBeenCalled();
    });

    it('deve lançar um erro se o valor do chips for maior do que o disponível no jogo', async () => {
      const dto = { playerId: 1, chips: 100 };
      const gameId = 1;
      const player = new Player({ id: 1 });
      const game = new Game({
        id: gameId,
        buyIns: [new BuyIn({ id: 1, player, chips: 50 })],
        cashOuts: [],
      });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(player);

      await expect(service.create(gameId, dto)).rejects.toThrowError(
        'O valor de fichas é maior do que o disponível no jogo',
      );
      expect(gameRepository.findOne).toHaveBeenCalled();
      expect(playerService.findOne).toHaveBeenCalled();
    });

    it('deve lançar um erro se o valor de chips for maior do que a diferença entre o buyIn e o cashOut', async () => {
      const dto = { playerId: 1, chips: 100 };
      const gameId = 1;
      const player = new Player({ id: 1 });
      const game = new Game({
        id: gameId,
        buyIns: [new BuyIn({ id: 1, player, chips: 100 })],
        cashOuts: [new CashOut({ id: 1, player, chips: 50 })],
      });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(player);

      await expect(service.create(gameId, dto)).rejects.toThrowError(
        'O valor de fichas é maior do que o disponível no jogo',
      );
      expect(gameRepository.findOne).toHaveBeenCalled();
      expect(playerService.findOne).toHaveBeenCalled();
    });
  });
});
