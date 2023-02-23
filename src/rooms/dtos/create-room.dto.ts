import { ApiProperty } from '@nestjs/swagger';
import { RoomTypeEnum } from '../../etc/enums';
import { CreateQuestionDto } from './create-question.dto';

export class CreateRoomDto {
  @ApiProperty()
  code: string;

  @ApiProperty()
  openTime: Date;

  @ApiProperty()
  closeTime: Date;

  @ApiProperty()
  duration: number;

  @ApiProperty({ required: false })
  colors?: string;

  @ApiProperty({ enum: RoomTypeEnum })
  type: RoomTypeEnum;

  @ApiProperty({ default: false })
  isPrivate: boolean;

  @ApiProperty({ type: [CreateQuestionDto], required: false })
  questions?: CreateQuestionDto[];
}
