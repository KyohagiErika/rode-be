import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomTypeEnum } from '../../etc/enums';
import { Question } from './question.entity';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  openTime: Date;

  @Column()
  closeTime: Date;

  @Column()
  duration: number;

  @Column({ nullable: true })
  colors: string;

  @Column({ type: 'enum', enum: RoomTypeEnum })
  type: RoomTypeEnum;

  @OneToMany(() => Question, (question) => question.room, {
    cascade: true,
  })
  questions: Question[];

  @Column({ default: false })
  isPrivate: boolean;
}
