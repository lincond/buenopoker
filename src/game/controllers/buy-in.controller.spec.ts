import { Test, TestingModule } from '@nestjs/testing';
import { BuyInController } from './buy-in.controller';
import { BuyInService } from '../services';
import { BuyIn } from '../entities';

describe('BuyInController', () => {
  let controller: BuyInController;
  let service: BuyInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyInController],
      providers: [
        {
          provide: BuyInService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BuyInController>(BuyInController);
    service = module.get<BuyInService>(BuyInService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { playerId: 1, chips: 1000 };
    const gameId = 1;

    const response = {
      redirect: jest.fn(),
    } as unknown as any;

    it('deve criar um buy-in', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(new BuyIn({ id: 1 }));

      await controller.create(gameId, dto, response);

      expect(service.create).toHaveBeenCalledWith(gameId, dto);
      expect(response.redirect).toHaveBeenCalledWith('/game/1');
    });
  });
});
