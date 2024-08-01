import { Player } from "src/player/entities/player.entity";
import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Game } from "./game.entity";

@Entity()
export class BuyIn {
  @PrimaryGeneratedColumn()
  id: number;

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
