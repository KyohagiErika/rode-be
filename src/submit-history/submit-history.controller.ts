import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubmitHistoryService } from './submit-history.service';

@Controller('submitHistorys')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistorys')
@ApiBearerAuth()
export class SubmitHistoryController {
  constructor(private readonly submiHistoryService: SubmitHistoryService) {}
}
