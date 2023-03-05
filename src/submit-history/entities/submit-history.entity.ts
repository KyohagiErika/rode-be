import { Account } from '../../accounts/entities/account.entity';
import { Question } from '../../rooms/entities/question.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SubmitHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  submissions: string;

  @CreateDateColumn()
  submittedAt: Date;

  @Column()
  linesOfCode: number;

  @Column()
  time: number;

  @Column()
  space: number;

  @ManyToOne(() => Account, (account) => account.submitHistory)
  account: Account;

  @ManyToOne(() => Question, (question) => question.submitHistory)
  question: Question;
}
