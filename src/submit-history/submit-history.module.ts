import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { SubmitHistoryController } from './submit-history.controller';
import { SubmitHistoryService } from './submit-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmitHistory])],
  controllers: [SubmitHistoryController],
  providers: [SubmitHistoryService],
  exports: [SubmitHistoryService],
})
export class SubmitHistoryModule {}
