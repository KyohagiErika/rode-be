import { ApiProperty, PartialType,OmitType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsNumber, IsOptional, ValidateNested } from "class-validator";
import { CreateQuestionDto } from "./create-question.dto";
import { UpdateQuestionTestCaseDto } from "./update-question-testcase.dto";

export class UpdateQuestionDto extends PartialType(OmitType(CreateQuestionDto, ['testCases'] as const)) {
    @ApiProperty({ required: false })
    @IsOptional()
    id?: string;

    @ApiProperty({ type: [UpdateQuestionTestCaseDto] })
    @IsDefined()
    @ValidateNested()
    @Type(() => UpdateQuestionTestCaseDto)
    testCases: UpdateQuestionTestCaseDto[];
}