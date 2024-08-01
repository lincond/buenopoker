import { Player } from "src/player/entities/player.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Game } from "./game.entity";

@Entity()
export class CashOut {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Player, (player) => player.cashOuts)
  player: Player;

  @ManyToOne(() => Game, (game) => game.cashOuts)
  game: Game;

  @Column({ type: 'int' })
  chips: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(partial: Partial<CashOut>) {
    Object.assign(this, partial);
  }
}
