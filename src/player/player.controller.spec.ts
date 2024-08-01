import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { Player } from './entities/player.entity';

describe('PlayerController', () => {
  let controller: PlayerController;
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        {
          provide: PlayerService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  const dto = { name: 'John Doe', pix: 'pix' };
  const player = new Player({ id: 1, ...dto });

  describe('create', () => {
    it('deve criar um jogador', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(player);

      await controller.create(dto);

      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de jogadores', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([player]);

      expect(await controller.findAll()).toEqual({ players: [player] });
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
