import { ApiProperty } from "@nestjs/swagger";
import { CreateQuestionTestCaseDto } from "./create-question-testcase.dto";

export class CreateQuestionDto {
    @ApiProperty()
    questionImage: string;

    @ApiProperty({ required: false })
    maxSubmitTimes?: number;

    @ApiProperty({ required: false })
    colors?: string;

    @ApiProperty({ required: false })
    htmlTemplate?: string;

    @ApiProperty({ type: [CreateQuestionTestCaseDto], required: false })
    testCases?: CreateQuestionTestCaseDto[];
}