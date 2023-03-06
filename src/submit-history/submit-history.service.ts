import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,
  ) {}

  async getByQuestion(question: string) {
    const err = [];
    const submitHistory = await this.submitHistoryRepository.find({
      where: {
        question: { id: question },
      },
      order: {
        score: 'DESC',
        time: 'ASC',
        space: 'ASC',
      },
    });
    if (!submitHistory) {
      err.push({
        at: 'question',
        message: 'can not find question',
      });
      return [null, err];
    }
    return [submitHistory, null];
  }
}
