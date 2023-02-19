import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";

@Entity()
export class RoomQuestionImage {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    room: Room;

    @Column()
    questionImage: string;
}