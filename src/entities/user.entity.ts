import { Exclude } from "class-transformer";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Review } from "./review.entity";
import { Topic } from "./topic.entity";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({unique: true})
  nickname: string;

  @Column({unique: true})
  email: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[]

  @OneToMany(() => Topic, (topic) => topic.user)
  topics: Topic[]

  @CreateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)"})
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
  updated_at: Date;

}