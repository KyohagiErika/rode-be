import { ApiProperty } from "@nestjs/swagger";

export class CreateAccountDto {
    @ApiProperty()
    fname: string;

    @ApiProperty()
    lname: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    studentId: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    dob: Date;
}