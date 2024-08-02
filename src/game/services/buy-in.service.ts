import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BuyIn } from '../entities/buy-in.entity';
import { Repository } from 'typeorm';
import { CreateBuyInDto } from '../dto/create-buy-in.dto';
import { Game } from '../entities/game.entity';
import { PlayerService } from '../../player/player.service';
import { QrCodePix } from 'qrcode-pix';
import { Pix } from '../entities';

@Injectable()
export class BuyInService {
  private readonly logger = new Logger(BuyInService.name);

  constructor(
    @InjectRepository(BuyIn)
    private readonly buyInRepository: Repository<BuyIn>,
    @InjectRepository(Game)
    private readonly gameRepository: Repository<Game>,
    private readonly playerService: PlayerService,
  ) {}

  async create(gameId: number, createBuyInDto: CreateBuyInDto) {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new Error('Jogo não encontrado');
    }

    const player = await this.playerService.findOne(createBuyInDto.playerId);
    if (!player) {
      throw new Error('Jogador inválido');
    }

    const value = (game.dolar * createBuyInDto.chips) / 10_000;
    this.logger.debug(`Valor do Pix: R$ ${value.toFixed(2)}`);

    this.logger.debug(
      `Gerando Pix para ${game.pixName} na chave: ${game.pixKey}`,
    );
    const qrCodePix = QrCodePix({
      version: '01',
      key: game.pixKey,
      name: game.pixName,
      city: 'GOIANIA',
      message: `Buy In do ${player.name}`,
      cep: '74223230',
      value,
    });

    const pix = new Pix({
      payload: qrCodePix.payload(),
      base64: await qrCodePix.base64(),
    });

    const buyIn = new BuyIn({ player, game, pix, chips: createBuyInDto.chips });
    return await this.buyInRepository.save(buyIn);
  }
}
