import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Room } from './room.entity';

@Entity()
export class RoomTestCase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  input: string;

  @Column()
  output: string;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;
}
