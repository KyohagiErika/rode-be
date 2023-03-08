import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import ResponseObject from '@etc/response-object';
import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubmitHistoryService } from './submit-history.service';

@Controller('submit-history')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistory')
@ApiBearerAuth()
export class SubmitHistoryController {
  constructor(private readonly submiHistoryService: SubmitHistoryService) {}

  @Get('get-by-question/:question')
  async getByQuestion(@Param('question') question: string) {
    const [submitHistory, err] = await this.submiHistoryService.getByQuestion(
      question,
    );
    if (!question) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Get leader board failed!',
        null,
        err,
      );
    }

    return new ResponseObject(
      HttpStatus.OK,
      'Get all leader board success!',
      submitHistory,
      null,
    );
  }

  @Get('get by room/:roomId')
  async getByRoom(@Param('roomId') roomId: string) {
    const [submits, err] = await this.submiHistoryService.getByRoom(roomId);
    return new ResponseObject(
      HttpStatus.OK,
      'Get all leader board success!',
      submits,
      null,
    );
  }
}
