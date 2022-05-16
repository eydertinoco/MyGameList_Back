import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Game } from "./game.entity";
import { User } from "./user.entity";

@Unique(['user', 'game'])
@Entity()
export class Review {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  comment: string;

  @Column()
  rate: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.reviews, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: User;

  @ManyToOne(() => Game, (game) => game.reviews, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  game: Game;

}