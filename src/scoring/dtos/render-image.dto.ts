import { ApiProperty } from '@nestjs/swagger';

export class RenderImageDto {
  @ApiProperty()
  html: string;
}
