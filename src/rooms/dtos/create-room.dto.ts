import { ApiProperty } from "@nestjs/swagger";
import { RoomTypeEnum } from "../../etc/enums";

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
    questions: string[];

    @ApiProperty({ required: false })
    color: string;

    @ApiProperty()
    type: RoomTypeEnum;
}