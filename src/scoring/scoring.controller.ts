import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScoringService } from './scoring.service';
import { SubmitDto } from './dtos/submit.dto';
import ResponseObject from '@etc/response-object';
import { RenderImageDto } from './dtos/render-image.dto';
import { Response } from 'express';

@Controller('scoring')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Scoring')
export class ScoringController {
  constructor(private readonly scoringService: ScoringService) {}

  @Post('test-submit')
  async testSubmit(@Body() body: SubmitDto) {
    const [result, err] = await this.scoringService.submit(body);
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

  @Post('render-image')
  async renderImage(@Body() body: RenderImageDto, @Res() res: Response) {
    const [result, err] = await this.scoringService.renderImage(body);
    res.header('Content-Type', 'image/png');
    return res.send(result);
  }

  @Post('render-diff-image')
  async renderDiffImage(@Body() body: SubmitDto, @Res() res: Response) {
    const [result, err] = await this.scoringService.renderDiffImage(body);
    res.header('Content-Type', 'image/png');
    return res.send(result);
  }
}
