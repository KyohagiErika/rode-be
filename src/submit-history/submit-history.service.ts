import { Account } from '@accounts/entities/account.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';
import { CreateSubmitDto } from './dtos/create-submit-history.dto';
import { Question } from '@rooms/entities/question.entity';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async getByQuestion(question: string) {
    const err = [];
    const submitHistory = await this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .innerJoinAndSelect(
        (subQuery) => {
          return subQuery
            .select('lastSubmit.account', 'account')
            .addSelect('MAX(lastSubmit.submittedAt)', 'submittedAt')
            .from(SubmitHistory, 'lastSubmit')
            .where('lastSubmit.question.id = :id')
            .setParameter('id', question)
            .groupBy('lastSubmit.account');
        },
        'lastSubmits',
        'lastSubmits.account = submitHistory.account AND lastSubmits.submittedAt = submitHistory.submittedAt',
      )
      .innerJoinAndSelect('submitHistory.account', 'account')
      .andWhere('account.isActive = true')
      .orderBy({
        'submitHistory.score': 'DESC',
        'submitHistory.time': 'ASC',
        'submitHistory.space': 'ASC',
      })
      .getMany();

    if (!submitHistory.length) {
      err.push({
        at: 'question',
        message: 'can not find question',
      });
      return [null, err];
    }
    return [submitHistory, err];
  }

  async getByRoom(roomId: string) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });
    if (!room) return [null, 'Room not exist'];
    const query = this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .select([
        'submitHistory.id',
        'submitHistory.language',
        'submitHistory.submittedAt',
      ])
      .addSelect('SUM(submitHistory.score)', 'totalScore')
      .addSelect('SUM(submitHistory.time)', 'totalTime')
      .addSelect('SUM(submitHistory.space)', 'totalSpace')
      .innerJoinAndSelect(
        (subQuery) => {
          return subQuery
            .addSelect('lastSubmit.account', 'account')
            .addSelect('lastSubmit.question', 'question')
            .addSelect('MAX(lastSubmit.submittedAt)', 'submittedAt')
            .from(SubmitHistory, 'lastSubmit')
            .innerJoin('lastSubmit.question', 'question')
            .innerJoin('question.room', 'room')
            .where('room.id = :roomId', { roomId: roomId })
            .groupBy('lastSubmit.account.id')
            .addGroupBy('lastSubmit.question.id');
        },
        'lastSubmits',
        'lastSubmits.account = submitHistory.account AND lastSubmits.question = submitHistory.question AND lastSubmits.submittedAt = submitHistory.submittedAt',
      )
      .innerJoinAndSelect('submitHistory.account', 'account')
      .where('account.isActive = true')
      .groupBy('submitHistory.account.id')
      .orderBy({
        totalscore: 'DESC',
        totalTime: 'ASC',
        totalSpace: 'ASC',
      });
    const getMany: any = await query.getMany();
    const getRawMany = await query.getRawMany();
    let i = 0;
    const submits = getMany.map((item) => {
      item.totalScore = getRawMany[i].totalScore;
      item.totalTime = getRawMany[i].totalTime;
      item.totalSpace = getRawMany[i].totalSpace;
      i++;
      return item;
    });
    return [submits, null];
  }

  async createSubmit(submitDto: CreateSubmitDto) {
    const account = await this.accountRepository.findOne({
      where: {
        id: submitDto.accountId,
      },
    });
    if (!account) return [null, 'Account not found!'];
    const question = await this.questionRepository.findOne({
      where: {
        id: submitDto.questionId,
      },
    });
    if (!question) return [null, 'Question not found!'];
    const submit = await this.submitHistoryRepository.save({
      score: submitDto.score,
      submissions: submitDto.submissions,
      submittedAt: submitDto.submittedAt,
      time: submitDto.time,
      space: submitDto.space,
      account: account,
      question: question,
    });
    return [submit, null];
  }
}
