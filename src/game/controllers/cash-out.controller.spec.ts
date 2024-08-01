import { Test, TestingModule } from '@nestjs/testing';
import { CashOutController } from './cash-out.controller';
import { CashOutService } from '../services';
import { CashOut } from '../entities';

describe('CashOutController', () => {
  let controller: CashOutController;
  let service: CashOutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CashOutController],
      providers: [
        {
          provide: CashOutService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        }
      ]
    }).compile();

    controller = module.get<CashOutController>(CashOutController);
    service = module.get<CashOutService>(CashOutService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = { playerId: 1, chips: 1000 };
    const gameId = 1;

    const response = {
      redirect: jest.fn()
    } as unknown as any;

    it('deve criar um cash-out', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(new CashOut({ id: 1 }));

      await controller.create(gameId, dto, response);

      expect(service.create).toHaveBeenCalledWith(gameId, dto);
      expect(response.redirect).toHaveBeenCalledWith('/game/1');
    });
  });
});

