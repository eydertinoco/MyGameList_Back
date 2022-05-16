import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./review.entity";

@Entity()
export class Game {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  thumbnail: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  genre: string;

  @Column()
  platform: string;

  @Column()
  publisher: string;

  @Column()
  developer: string;

  @Column({ type: 'timestamp' })
  release_date: Date;

  @OneToMany(() => Review, (review) => review.game)
  reviews: Review[]

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updated_at: Date;

}