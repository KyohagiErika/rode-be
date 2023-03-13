import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import ResponseObject from '@etc/response-object';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubmitHistoryService } from './submit-history.service';
import { RoleGuard } from '@auth/role.guard';
import Roles from '@decorators/roles.decorator';
import { RoleEnum } from '@etc/enums';
import { SubmitHistory } from './entities/submit-history.entity';

@Controller('submit-history')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistory')
@ApiBearerAuth()
export class SubmitHistoryController {
  constructor(private readonly submitHistoryService: SubmitHistoryService) {}

  @Get('get-by-question/:question')
  async getByQuestion(@Param('question') question: string) {
    const [submitHistory, err] = await this.submitHistoryService.getByQuestion(
      question,
    );
    if (!question || !submitHistory) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get leader board failed!',
        null,
        err,
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Get leader board successfully!',
      submitHistory,
      null,
    );
  }

  @Get('get-by-room/:roomId')
  async getByRoom(@Param('roomId') roomId: string) {
    const [submits, err] = await this.submitHistoryService.getByRoom(roomId);
    if (!submits)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not exist!',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all leader board success!',
      submits,
      null,
    );
  }

  @Get('get-user-history')
  @ApiQuery({ name: 'userId', required: true })
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'questionId', required: false })
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.USER)
  async showUserHistoryByRoom(
    @Param('userId') userId: string,
    @Param('roomId') roomId: string,
    @Param('questionId') questionId: string,
  ) {
    let submits: string | SubmitHistory[];
    let err;
    if (roomId) {
      [submits, err] = await this.submitHistoryService.showUserHistoryByRoom(
        userId,
        roomId,
      );
    } else {
      [submits, err] =
        await this.submitHistoryService.showUserHistoryByQuestion(
          userId,
          questionId,
        );
    }
    if (!submits)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get submits failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all submits success!',
      submits,
      null,
    );
  }

  @Get('get-users-history')
  @ApiQuery({ name: 'roomId', required: false })
  @ApiQuery({ name: 'questionId', required: false })
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async showAllSubmitsByRoom(
    @Param('roomId') roomId: string,
    @Param('questionId') questionId: string,
  ) {
    let submits: string | SubmitHistory[];
    let err;
    if (roomId) {
      [submits, err] = await this.submitHistoryService.showAllSubmitsByRoom(
        roomId,
      );
    } else {
      [submits, err] = await this.submitHistoryService.showAllSubmitsByQuestion(
        questionId,
      );
    }
    if (!submits)
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get submits failed',
        null,
        err,
      );
    return new ResponseObject(
      HttpStatus.OK,
      'Get all submits success!',
      submits,
      null,
    );
  }
}
