import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomQuestion } from './room-question.entity';
import { RoomTypeEnum } from '../../etc/enums';

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
  color: string;

  @Column({ type: 'enum', enum: RoomTypeEnum })
  type: RoomTypeEnum;

  @OneToMany(() => RoomQuestion, (question) => question.room, { cascade: true })
  questions: RoomQuestion[];
}
