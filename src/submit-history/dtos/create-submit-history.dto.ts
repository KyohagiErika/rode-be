import { ProgrammingLangEnum } from '@etc/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

export class CreateSubmitDto {
  @ApiProperty()
  @IsNotEmpty()
  accountId: string;

  @ApiProperty()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty()
  @IsNotEmpty()
  score: number;

  @ApiProperty()
  @IsNotEmpty()
  submissions: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  language: ProgrammingLangEnum;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  submittedAt: Date;

  @ApiProperty()
  time: number;

  @ApiProperty()
  space: number;
}
