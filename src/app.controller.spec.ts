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
      const playerRanking = [
        { player: 'John Doe', sum: 100 },
        { player: 'Jane Doe', sum: 200 },
      ];
      jest
        .spyOn(appService, 'getPlayerRanking')
        .mockResolvedValue(playerRanking);

      expect(await appController.getPlayerRanking()).toEqual({
        ranking: playerRanking,
      });
      expect(appService.getPlayerRanking).toHaveBeenCalled();
    });
  });
});
