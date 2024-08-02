import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Repository } from 'typeorm';
import { Game } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('GameService', () => {
  let service: GameService;
  let repository: Repository<Game>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    repository = module.get<Repository<Game>>(getRepositoryToken(Game));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um jogo', async () => {
      const dto = { dolar: 550, royalFlushFee: 2 };
      const game = new Game({ id: 1, dolar: 550, royalFlushFee: 2 });
      jest.spyOn(repository, 'save').mockResolvedValue(game);

      expect(await service.create(dto)).toEqual(game);
      expect(repository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de jogos', async () => {
      const game = new Game({ id: 1, dolar: 550, royalFlushFee: 2 });
      jest.spyOn(repository, 'find').mockResolvedValue([game]);

      expect(await service.findAll()).toEqual([game]);
      expect(repository.find).toHaveBeenCalledWith({
        relations: {
          buyIns: {
            player: true,
          },
          cashOuts: {
            player: true,
          },
        },
        order: {
          createdAt: -1,
        },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um jogo', async () => {
      const gameId = 1;
      const game = new Game({ id: gameId, dolar: 550, royalFlushFee: 2 });
      jest.spyOn(repository, 'findOne').mockResolvedValue(game);

      expect(await service.findOne(gameId)).toEqual(game);
      expect(repository.findOne).toHaveBeenCalledWith({
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
  });
});
