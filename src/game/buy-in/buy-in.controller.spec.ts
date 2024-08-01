import { Test, TestingModule } from '@nestjs/testing';
import { BuyInController } from './buy-in.controller';

describe('BuyInController', () => {
  let controller: BuyInController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyInController],
    }).compile();

    controller = module.get<BuyInController>(BuyInController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
