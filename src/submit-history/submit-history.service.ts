import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

  ) { }

  async getByQuestion(question: string) {
    const err = [];
    const submitHistory = await this.submitHistoryRepository.createQueryBuilder("submitHistory")
    .innerJoinAndSelect((subQuery)=> {
      return subQuery
      .select("lastSubmit.account", "account")
      .addSelect("MAX(lastSubmit.submittedAt)", "submittedAt")
      .from(SubmitHistory, "lastSubmit")
      .where("lastSubmit.question.id = :id")
      .groupBy("lastSubmit.account")
    }, 'lastSubmits', 'lastSubmits.account=submitHistory.account AND lastSubmits.submittedAt=submitHistory.submittedAt' )
    .leftJoinAndSelect("submitHistory.account","account")
    .where("submitHistory.question.id = :id")
    .setParameter("id", question)
    .orderBy({ "submitHistory.score": "DESC", "submitHistory.time": "ASC", "submitHistory.space": "ASC" })
    .getRawMany()

    if (!submitHistory.length) {
      err.push({
        at: 'question',
        message: 'can not find question',
      });
      return [null, err];
    }
    return [submitHistory, err];
  }
}
