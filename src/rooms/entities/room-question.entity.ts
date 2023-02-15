import { LocalFile } from "../../local-files/entities/local-file.entity";
import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";

@Entity()
export class RoomQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    room: Room;

    @ManyToOne(() => LocalFile, { onDelete: 'CASCADE' })
    question: LocalFile;
}