import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getPlayerRanking: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('getPlayerRanking', () => {
    it('should return the player ranking', async () => {
      const currentYear = new Date().getFullYear();
      const playerRanking = [
        { player: 'Bebeto', buyin: 500, cashout: 10, nett: -490, percent: -98 },
        { player: 'Zico', buyin: 500, cashout: 890, nett: 390, percent: 78 },
      ];
      jest
        .spyOn(appService, 'getPlayerRanking')
        .mockResolvedValue(playerRanking);

      expect(await appController.getPlayerRanking()).toEqual({
        ranking: playerRanking,
        sortedBy: 'nett',
        where: { year: currentYear },
      });
      expect(appService.getPlayerRanking).toHaveBeenCalled();
    });

    it('should return the player ranking with the specified parameters', async () => {
      const selectedYear = new Date().getFullYear() - 1;
      const sortBy = 'percent';
      const playerRanking = [
        { player: 'Bebeto', buyin: 500, cashout: 10, nett: -490, percent: -98 },
        { player: 'Zico', buyin: 500, cashout: 890, nett: 390, percent: 78 },
      ];
      jest
        .spyOn(appService, 'getPlayerRanking')
        .mockResolvedValue(playerRanking);

      expect(
        await appController.getPlayerRanking(sortBy, selectedYear),
      ).toEqual({
        ranking: playerRanking,
        sortedBy: sortBy,
        where: { year: selectedYear },
      });
      expect(appService.getPlayerRanking).toHaveBeenCalled();
    });
  });
});
