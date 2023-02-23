import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { QuestionTestCase } from "./question-test-case.entity";
import { Room } from "./room.entity";

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    questionImage: string;

    @Column()
    maxSubmitTimes: number;

    @ManyToOne(() => Room, { onDelete: 'CASCADE' })
    room: Room;

    @OneToMany(() => QuestionTestCase, (questionTestCase) => questionTestCase.question, { cascade: true })
    testCases: QuestionTestCase[];
}