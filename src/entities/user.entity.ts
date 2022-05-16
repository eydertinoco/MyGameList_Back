import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./review.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updated_at: Date;

}