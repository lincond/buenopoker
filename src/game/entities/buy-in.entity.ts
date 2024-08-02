import { Player } from '../../player/entities/player.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { Pix } from './pix.entity';

@Entity()
export class BuyIn {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  chips: number;

  @OneToOne(() => Pix, (pix) => pix.buyIn, { cascade: ['insert'] })
  @JoinColumn()
  pix: Pix;

  @ManyToOne(() => Player, (player) => player.buyIns)
  player: Player;

  @ManyToOne(() => Game, (game) => game.buyIns)
  game: Game;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<BuyIn>) {
    Object.assign(this, partial);
  }
}
