import { RoomTypeEnum } from '@etc/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@rooms/entities/question.entity';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
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
}
