import { ApiProperty } from "@nestjs/swagger";
import { ProgrammingLangEnum } from "../../etc/enums";

export class SubmitDto {
    @ApiProperty()
    roomId: string;

    @ApiProperty()
    code: string;

    @ApiProperty({ enum: ProgrammingLangEnum, required: false })
    language: ProgrammingLangEnum;
}