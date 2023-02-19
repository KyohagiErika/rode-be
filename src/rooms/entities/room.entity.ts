import { LocalFile } from "../../local-files/entities/local-file.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomQuestionImage } from "./room-question-image.entity";
import { RoomTypeEnum } from "../../etc/enums";
import { RoomTestCase } from "./room-test-case.entity";

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

    @OneToMany(() => RoomQuestionImage, question => question.room, { cascade: true })
    questions: RoomQuestionImage[];

    @OneToMany(() => RoomTestCase, testCase => testCase.room, { cascade: true })
    testCases: RoomTestCase[];
}