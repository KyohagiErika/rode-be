import { ApiProperty } from "@nestjs/swagger";
import { RoomTypeEnum } from "../../etc/enums";
import { CreateRoomTestCaseDto } from "./create-room-test-case.dto";

export class CreateRoomDto {
    @ApiProperty()
    code: string;

    @ApiProperty()
    openTime: Date;

    @ApiProperty()
    closeTime: Date;

    @ApiProperty()
    duration: number;

    @ApiProperty()
    questionImages: string[];

    @ApiProperty({ required: false })
    color: string;

    @ApiProperty({ type: [CreateRoomTestCaseDto], required: false })
    testCases: CreateRoomTestCaseDto[];

    @ApiProperty({ enum: RoomTypeEnum })
    type: RoomTypeEnum;
}