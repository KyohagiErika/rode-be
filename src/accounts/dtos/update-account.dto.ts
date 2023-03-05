import { OmitType } from '@nestjs/mapped-types';
import { PartialType, PickType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(OmitType(CreateAccountDto, ['email'] as const)) {}
