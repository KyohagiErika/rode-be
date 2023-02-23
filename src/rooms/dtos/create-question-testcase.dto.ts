import { ApiProperty } from "@nestjs/swagger";

export class CreateQuestionTestCaseDto {
    @ApiProperty()
    input: string;

    @ApiProperty()
    output: string;
}