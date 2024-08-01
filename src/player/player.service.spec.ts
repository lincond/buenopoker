import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { Repository } from 'typeorm';
import { Player } from './entities/player.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepository: Repository<Player>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    playerRepository = module.get<Repository<Player>>(
      getRepositoryToken(Player),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(playerRepository).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um jogador', async () => {
      const player = new Player({ name: 'John Doe' });
      jest.spyOn(playerRepository, 'save').mockResolvedValue(player);
      const dto = { name: 'John Doe', pix: 'pix' };

      expect(await service.create(dto)).toEqual(player);
      expect(playerRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de jogadores', async () => {
      const player = new Player({ name: 'John Doe' });
      jest.spyOn(playerRepository, 'find').mockResolvedValue([player]);

      expect(await service.findAll()).toEqual([player]);
      expect(playerRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('deve retornar um jogador', async () => {
      const playerId = 1;
      const player = new Player({ id: playerId, name: 'John Doe' });
      jest.spyOn(playerRepository, 'findOne').mockResolvedValue(player);

      expect(await service.findOne(playerId)).toEqual(player);
      expect(playerRepository.findOne).toHaveBeenCalledWith({
        where: { id: playerId },
      });
    });
  });
});
