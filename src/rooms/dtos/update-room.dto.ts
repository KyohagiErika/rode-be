import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, ValidateNested } from 'class-validator';
import { CreateRoomDto } from './create-room.dto';
import { UpdateQuestionDto } from './update-question.dto';

export class UpdateRoomDto extends PartialType(
  OmitType(CreateRoomDto, ['isPrivate', 'questions', 'type'] as const),
) {
  @ApiProperty({ type: [UpdateQuestionDto] })
  @IsDefined()
  @ValidateNested()
  @Type(() => UpdateQuestionDto)
  questions: UpdateQuestionDto[];
}
