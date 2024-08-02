import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BuyIn } from '.';

@Entity()
export class Pix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  payload: string;

  @Column()
  base64: string;

  @OneToOne(() => BuyIn, (buyIn) => buyIn.pix)
  buyIn: BuyIn;

  @CreateDateColumn()
  createdAt: number;

  @UpdateDateColumn()
  updateAt: number;

  constructor(partial: Partial<Pix>) {
    Object.assign(this, partial);
  }
}
