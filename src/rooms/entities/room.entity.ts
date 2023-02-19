<<<<<<< HEAD
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomQuestion } from './room-question.entity';
import { RoomTypeEnum } from '../../etc/enums';
=======
import { LocalFile } from "../../local-files/entities/local-file.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomQuestionImage } from "./room-question-image.entity";
import { RoomTypeEnum } from "../../etc/enums";
import { RoomTestCase } from "./room-test-case.entity";
>>>>>>> 59646ac1f94509c79fb795fea162c10e291be9b6

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

<<<<<<< HEAD
  @OneToMany(() => RoomQuestion, (question) => question.room, { cascade: true })
  questions: RoomQuestion[];
}
=======
    @OneToMany(() => RoomQuestionImage, question => question.room, { cascade: true })
    questions: RoomQuestionImage[];

    @OneToMany(() => RoomTestCase, testCase => testCase.room, { cascade: true })
    testCases: RoomTestCase[];
}
>>>>>>> 59646ac1f94509c79fb795fea162c10e291be9b6
