import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { Repository } from 'typeorm';
import { Game } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BetweenDatesAdapter } from '../../common/adapters/between.adapter';

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
    it('should return the created game', async () => {
      const dto = {
        dolar: 550,
        royalFlushFee: 2,
        pixName: 'pixName',
        pixKey: 'pixKey',
      };
      const game = new Game({ id: 1, dolar: 550, royalFlushFee: 2 });
      jest.spyOn(repository, 'save').mockResolvedValue(game);

      expect(await service.create(dto)).toEqual(game);
      expect(repository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return a list of all games', async () => {
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
    it('should return just one game', async () => {
      const gameId = 1;
      const game = new Game({ id: gameId, dolar: 550, royalFlushFee: 2 });
      jest.spyOn(repository, 'findOne').mockResolvedValue(game);

      expect(await service.findOne(gameId)).toEqual(game);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: gameId },
        relations: {
          buyIns: {
            player: true,
            pix: true,
          },
          cashOuts: {
            player: true,
          },
        },
      });
    });
  });

  describe('findByCreatedAtBetween', () => {
    it('should return a list of matching games', async () => {
      const currentYear = new Date().getFullYear();
      const createdAtBetween = new BetweenDatesAdapter(currentYear);
      const game = new Game({
        id: 1,
        dolar: 550,
        royalFlushFee: 2,
        createdAt: new Date(),
      });
      jest.spyOn(repository, 'find').mockResolvedValue([game]);

      expect(await service.findByCreatedAtBetween(createdAtBetween)).toEqual([
        game,
      ]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { createdAt: createdAtBetween.adapt() },
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

    it('should return an empty list when there are no matching games', async () => {
      const currentYear = new Date().getFullYear();
      const createdAtBetween = new BetweenDatesAdapter(currentYear);
      const game = new Game({
        id: 1,
        dolar: 550,
        royalFlushFee: 2,
        createdAt: new Date(`${currentYear - 1}-05-05`),
      });
      jest
        .spyOn(repository, 'find')
        .mockImplementation(async () =>
          [game].filter(({ createdAt }) =>
            createdAtBetween.validate(createdAt),
          ),
        );

      expect(await service.findByCreatedAtBetween(createdAtBetween)).toEqual(
        [] as Game[],
      );
      expect(repository.find).toHaveBeenCalledWith({
        where: { createdAt: createdAtBetween.adapt() },
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
});
