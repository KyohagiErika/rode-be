import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomTestCaseDto {
  @ApiProperty()
  input: string;

  @ApiProperty()
  output: string;
}
