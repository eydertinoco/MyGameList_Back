import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Game {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column()
  thumbnail: string;

  @Column()
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

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updated_at: Date;

}