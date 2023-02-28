import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleGuard } from '../auth/role.guard';
import Roles from '../decorators/roles.decorator';
import { RoleEnum } from '../etc/enums';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScoringService } from './scoring.service';
import CurrentAccount from '../decorators/current-account.decorator';
import { Account } from '../accounts/entities/account.entity';
import { SubmitDto } from './dtos/submit.dto';
import ResponseObject from '@etc/response-object';

@Controller('scoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('test-submit')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  async testSubmit(
    @CurrentAccount() account: Account,
    @Body() body: SubmitDto,
  ) {
    const [result, err] = await this.scoringService.submit(account, body);
    if (err) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Submit failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Submit success!', result, null);
  }

  @Get('test-image')
  async testImage() {
    return await this.scoringService.testImage();
  }
}
