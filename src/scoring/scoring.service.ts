import { Injectable } from '@nestjs/common';
import { RoomsService } from '../rooms/rooms.service';
import { SubmitDto } from './dtos/submit.dto';
import { ProgrammingLangEnum, RoomTypeEnum } from '../etc/enums';
import { C_CPPSevice } from './compile-and-execute-services/c_cpp.service';
import { JavaService } from './compile-and-execute-services/java.service';
import { PixelMatchService } from './pixel-match.service';
import { RenderImageDto } from './dtos/render-image.dto';
import { BeResultDto } from './dtos/be-result.dto';
import { FeResultDto } from './dtos/fe-result.dto';

@Injectable()
export class ScoringService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly c_cppService: C_CPPSevice,
    private readonly javaService: JavaService,
    private readonly pixelMatchService: PixelMatchService,
  ) {}

  async submit(submitDto: SubmitDto): Promise<[BeResultDto | FeResultDto, any]> {
    const [room, err] = await this.roomsService.findOneById(submitDto.roomId);
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
        const [result, err] = await this.pixelMatchService.score(question.questionImage, submitDto.code);
        return [result, err];
      }
      default: {
        return [null, 'Room type not supported'];
      }
    }
  }

  async renderImage(info: RenderImageDto) {
    return await this.pixelMatchService.renderImage(info.html);
  }

  async renderDiffImage(submitDto: SubmitDto) {
    const [room, err] = await this.roomsService.findOneById(submitDto.roomId);
    if (err) {
      return [null, err];
    }
    const question = room.questions.find(
      (ele) => ele.id == submitDto.questionId,
    );
    if (!question) {
      return [null, 'Question not found'];
    }
    if (room.type != RoomTypeEnum.FE) {
      return [null, 'Room type not supported'];
    }
    return await this.pixelMatchService.renderDiffImage(question.questionImage, submitDto.code);
  }
}
