import { Test, TestingModule } from '@nestjs/testing';
import { BuyInService } from './buy-in.service';
import { Repository } from 'typeorm';
import { BuyIn, Game } from '../entities';
import { PlayerService } from '../../player/player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from '../../player/entities/player.entity';

describe('BuyInService', () => {
  let service: BuyInService;
  let repository: Repository<BuyIn>;
  let gameRepository: Repository<Game>;
  let playerService: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BuyInService,
        {
          provide: getRepositoryToken(BuyIn),
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

    service = module.get<BuyInService>(BuyInService);
    repository = module.get<Repository<BuyIn>>(getRepositoryToken(BuyIn));
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
    it('deve criar um buy-in', async () => {
      const dto = { playerId: 1, chips: 100 };
      const game = new Game({ id: 1 });
      const player = new Player({ id: 1 });
      const buyIn = new BuyIn({ id: 1, game, player, chips: 100 });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(player);
      jest.spyOn(repository, 'save').mockResolvedValue(buyIn);

      await service.create(1, dto);

      expect(gameRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(playerService.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(
        new BuyIn({ player, game, chips: dto.chips }),
      );
    });

    it('deve lançar um erro se o jogo não existir', async () => {
      const dto = { playerId: 1, chips: 100 };

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(undefined);

      await expect(service.create(1, dto)).rejects.toThrowError(
        'Jogo não encontrado',
      );
    });

    it('deve lançar um erro se o jogador não existir', async () => {
      const dto = { playerId: 1, chips: 100 };
      const game = new Game({ id: 1 });

      jest.spyOn(gameRepository, 'findOne').mockResolvedValue(game);
      jest.spyOn(playerService, 'findOne').mockResolvedValue(undefined);

      await expect(service.create(1, dto)).rejects.toThrowError(
        'Jogador inválido',
      );
    });
  });
});
