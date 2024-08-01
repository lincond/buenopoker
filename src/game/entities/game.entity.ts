import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BuyIn } from './buy-in.entity';
import { CashOut } from './cash-out.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  dolar: number;

  @Column({ type: 'int' })
  royalFlushFee: number;

  @OneToMany(() => BuyIn, (buyIn) => buyIn.game)
  buyIns: BuyIn[];

  @OneToMany(() => CashOut, (cashOut) => cashOut.game)
  cashOuts: CashOut[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Game>) {
    Object.assign(this, partial);
  }
}
