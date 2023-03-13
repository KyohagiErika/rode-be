import { ApiProperty } from '@nestjs/swagger';

export class CheckAttendanceDto {
  @ApiProperty({ type: [String] })
  id: string[];
}
