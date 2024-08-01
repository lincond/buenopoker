import { Test, TestingModule } from '@nestjs/testing';
import { BuyInService } from './buy-in.service';

describe('BuyInService', () => {
  let service: BuyInService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyInService],
    }).compile();

    service = module.get<BuyInService>(BuyInService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
