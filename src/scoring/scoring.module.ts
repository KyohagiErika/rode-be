import { Inject, Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { ScoringController } from './scoring.controller';
import { RoomsModule } from '../rooms/rooms.module';
import * as path from 'path';
import * as fs from 'fs';
import { C_CPPSevice } from './compile-and-execute-services/c_cpp.service';
import { JavaService } from './compile-and-execute-services/java.service';

@Module({
  controllers: [ScoringController],
  providers: [
    {
      provide: 'SCORING_PATH',
      useValue: path.resolve(__dirname + '/../../scoring'),
    },
    ScoringService,
    C_CPPSevice,
    JavaService,
  ],
  imports: [RoomsModule],
})
export class ScoringModule {
  constructor(@Inject('SCORING_PATH') private scoringPath: string) {}

  onModuleInit() {
    if (!fs.existsSync(this.scoringPath)) {
      fs.mkdirSync(this.scoringPath);
    }
  }
}
