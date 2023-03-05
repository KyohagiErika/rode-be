import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SubmiHistoryService } from './submitHistory.service';

@Controller('submitHistorys')
@UseGuards(JwtAuthGuard)
@ApiTags('SubmitHistorys')
@ApiBearerAuth()
export class SubmiHistoryController {
  constructor(private readonly submiHistoryService: SubmiHistoryService) {}
}
