import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submitHistory.entity';

@Injectable()
export class SubmiHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,
  ) {}
}
