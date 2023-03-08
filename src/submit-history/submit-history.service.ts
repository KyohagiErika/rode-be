import { RoomTypeEnum } from '@etc/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@rooms/entities/question.entity';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';
import { CreateSubmitDto } from './dtos/create-submit-history.dto';
import { Account } from '@accounts/entities/account.entity';

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
    const checkQuestion = await this.questionRepository.findOne({
      relations: {
        room: true,
      },
      where: {
        id: question,
      },
    });

    let submitHistory: SubmitHistory[] = [];

    if (checkQuestion.room.type == RoomTypeEnum.BE) {
      submitHistory = await this.submitHistoryRepository.find({
        relations: {
          account: true,
        },
        select: {
          account: { fname: true, lname: true },
          score: true,
          time: true,
          submittedAt: true,
        },
        where: {
          question: { id: question },
        },
        order: {
          score: 'DESC',
          time: 'ASC',
          space: 'ASC',
        },
      });
    } else {
      submitHistory = await this.submitHistoryRepository.find({
        relations: {
          account: true,
        },
        select: {
          account: { fname: true, lname: true },
          score: true,
          space: true,
          submittedAt: true,
        },
        where: {
          question: { id: question },
        },
        order: {
          score: 'DESC',
          time: 'ASC',
          space: 'ASC',
        },
      });
    }
    if (!submitHistory) {
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
    const submits = await this.submitHistoryRepository
      .createQueryBuilder('submitHistory')
      .leftJoinAndSelect('submitHistory.account', 'account')
      .leftJoin('submitHistory.question', 'question')
      .groupBy('submitHistory.account.id')
      .addGroupBy('submitHistory.question.id')
      .orderBy('submitHistory.account.id')
      .addOrderBy('submitHistory.submittedAt', 'DESC')
      .getMany();
    if (!submits.length) return [submits, null];
    const leaderboard = [];
    let totalScore = submits[0].score;
    let totalTime = submits[0].time;
    let totalSpace = submits[0].space;
    let submittedAt = submits[0].submittedAt;
    for (let i = 1; i < submits.length; i++) {
      if (submits[i].account.id == submits[i - 1].account.id) {
        totalScore += submits[i].score;
        totalTime += submits[i].time;
        totalSpace += submits[i].space;
      } else {
        leaderboard.push({
          account: submits[i - 1].account,
          score: totalScore,
          time: totalTime,
          space: totalSpace,
          submittedAt: submittedAt,
        });
        totalScore = submits[i].score;
        totalTime = submits[i].time;
        totalSpace = submits[i].space;
        submittedAt = submits[i].submittedAt;
      }
    }
    leaderboard.push({
      account: submits[submits.length - 1].account,
      score: totalScore,
      time: totalTime,
      space: totalSpace,
      submittedAt: submittedAt,
    });
    leaderboard.sort((a, b) => {
      if (a.score == b.score) {
        if (a.time == b.time) {
          return a.space - b.space;
        }
        return a.time - b.time;
      }
      return a.score - b.score;
    });
    return [leaderboard, null];
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
