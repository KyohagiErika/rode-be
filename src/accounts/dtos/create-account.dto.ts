import { ApiProperty } from "@nestjs/swagger";
import { RoleEnum } from "../../etc/enums";

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

    @ApiProperty({ enum: RoleEnum, default: RoleEnum.USER })
    role: RoleEnum;
}