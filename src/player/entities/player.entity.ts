import { BuyIn, CashOut } from '../../game/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  pix: string;

  @OneToMany(() => BuyIn, (buyIn) => buyIn.player)
  buyIns: BuyIn[];

  @OneToMany(() => CashOut, (cashOut) => cashOut.player)
  cashOuts: CashOut[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<Player>) {
    Object.assign(this, partial);
  }
}
