import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsNotEmpty, IsPhoneNumber, Matches } from 'class-validator';

export class CreateAccountDto {
  @ApiProperty()
  @IsNotEmpty()
  fname: string;

  @ApiProperty()
  @IsNotEmpty()
  lname: string;

  @ApiProperty()
  @IsEmail()
  @Matches(/@fpt\.edu\.vn$/, { message: 'Email must be FPT email' })
  email: string;

  @ApiProperty()
  @Matches(/^[A-Z]{2}\d{6}$/)
  studentId: string;

  @ApiProperty()
  @IsPhoneNumber('VN')
  phone: string;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  dob: Date;
}
