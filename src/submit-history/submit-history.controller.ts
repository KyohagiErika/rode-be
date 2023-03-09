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
      'Get leader board successfull!',
      submitHistory,
      null,
    );
  }
}
