import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmitHistory } from './entities/submitHistory.entity';
import { SubmiHistoryController } from './submitHistory.Controller';
import { SubmiHistoryService } from './submitHistory.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubmitHistory])],
  controllers: [SubmiHistoryController],
  providers: [SubmiHistoryService],
  exports: [SubmiHistoryService],
})
export class SubmitHistoryModule {}
