import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { SubmiHistoryController } from './submit-history.controller';
import { SubmiHistoryService } from './submit-history.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmitHistory])],
  controllers: [SubmiHistoryController],
  providers: [SubmiHistoryService],
  exports: [SubmiHistoryService],
})
export class SubmitHistoryModule {}
