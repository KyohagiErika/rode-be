import { Account } from '../../accounts/entities/account.entity';
import { Question } from '../../rooms/entities/question.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SubmitHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  score: number;

  @Column()
  submision: string;

  @Column()
  submittedAt: Date;

  @Column()
  linesOfCode: number;

  @Column()
  time: number;

  @Column()
  space: number;

  @ManyToOne(() => Account, (account) => account.submiHistorys)
  account: Account;

  @ManyToOne(() => Question, (question) => question.submiHistorys)
  question: Question;
}
