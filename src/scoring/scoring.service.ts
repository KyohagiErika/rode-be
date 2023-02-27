import { Injectable } from '@nestjs/common';
import { Account } from '../accounts/entities/account.entity';
import { RoomsService } from '../rooms/rooms.service';
import { SubmitDto } from './dtos/submit.dto';
import { ProgrammingLangEnum, RoomTypeEnum } from '../etc/enums';
import { C_CPPSevice } from './compile-and-execute-services/c_cpp.service';
import { JavaService } from './compile-and-execute-services/java.service';
import { PixelMatchService } from './pixel-match.service';
import * as fs from 'fs';
import { resolve } from 'path';

@Injectable()
export class ScoringService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly c_cppService: C_CPPSevice,
    private readonly javaService: JavaService,
    private readonly pixelMatchService: PixelMatchService,
  ) {}

  async submit(account: Account, submitDto: SubmitDto): Promise<[any, any]> {
    const [room, err] = await this.roomsService.findOneById(submitDto.roomId, true);
    if (err) {
      return [null, err];
    }
    const question = room.questions.find(
      (ele) => ele.id == submitDto.questionId,
    );
    if (!question) {
      return [null, 'Question not found'];
    }
    switch (room.type) {
      case RoomTypeEnum.BE: {
        switch (submitDto.language) {
          case ProgrammingLangEnum.C_CPP: {
            return this.c_cppService.compileAndExecute(
              submitDto.code,
              question.testCases,
            );
          }
          case ProgrammingLangEnum.JAVA: {
            return this.javaService.compileAndExecute(
              submitDto.code,
              question.testCases,
            );
          }
          default: {
            return [null, 'Language not supported'];
          }
        }
      }
      case RoomTypeEnum.FE: {
      }
      default: {
        return [null, 'Room type not supported'];
      }
    }
  }

  async testImage() {
    const htmlContent = fs.readFileSync(resolve(__dirname + '/../../css-scoring/test.html'));
    const css = fs.readFileSync(resolve(__dirname + '/../../css-scoring/test.css'));
    await this.pixelMatchService.test(css.toString(), htmlContent.toString());
  }
}
