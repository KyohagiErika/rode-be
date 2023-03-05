import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { CreateQuestionTestCaseDto } from "./create-question-testcase.dto";

export class UpdateQuestionTestCaseDto extends PartialType(CreateQuestionTestCaseDto) {
    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    id?: number;
}