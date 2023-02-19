import { Injectable } from '@nestjs/common';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import { Account } from '../accounts/entities/account.entity';
import { RoomsService } from '../rooms/rooms.service';
import { SubmitDto } from './dtos/submit.dto';
import { ProgrammingLangEnum, RoomTypeEnum } from '../etc/enums';
import { C_CPPSevice } from './compile-and-execute-services/c_cpp.service';
import { JavaService } from './compile-and-execute-services/java.service';

@Injectable()
export class ScoringService {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly c_cppService: C_CPPSevice,
    private readonly javaService: JavaService,
  ) {}

  async submit(account: Account, submitDto: SubmitDto): Promise<[any, any]> {
    const [room, err] = await this.roomsService.findOneById(submitDto.roomId);
    if (err) {
      return [null, err];
    }
    if (room.type == RoomTypeEnum.BE) {
      if (submitDto.language == ProgrammingLangEnum.C_CPP) {
        return this.c_cppService.compileAndExecute(
          submitDto.code,
          room.testCases,
        );
      } else if (submitDto.language == ProgrammingLangEnum.JAVA) {
        const [result, err] = this.javaService.compile(submitDto.code);
        return [result, err];
      } else {
        return [null, 'Language not supported'];
      }
    } else {
      return [null, null];
    }
  }
}
