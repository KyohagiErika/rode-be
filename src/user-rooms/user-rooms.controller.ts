import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Body,
} from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@auth/jwt-auth.guard';
import { RoleGuard } from '@auth/role.guard';
import Roles from '@decorators/roles.decorator';
import { RoleEnum } from '@etc/enums';
import { Account } from '@accounts/entities/account.entity';
import CurrentAccount from '@decorators/current-account.decorator';
import { RoomsService } from '@rooms/rooms.service';
import ResponseObject from '@etc/response-object';
import { JoinRoomDTO } from './dtos/join-room.dto';

@Controller('user-rooms')
@ApiTags('UserRooms')
export class UserRoomsController {
  constructor(
    private readonly userRoomsService: UserRoomsService,
    private readonly roomsService: RoomsService,
  ) {}

  /**
   * User Join Room
   * - public room: user can join without code
   * - private room: user must enter code to join
   * @param roomReq
   * @param curAccount
   * @returns
   */
  @Post('join')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Join room' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @UsePipes(new ValidationPipe({ skipMissingProperties: true }))
  @Roles(RoleEnum.USER)
  async join(
    @Body() roomReq: JoinRoomDTO,
    @CurrentAccount() curAccount: Account,
  ) {
    const [room, error] = await this.roomsService.findOneById(roomReq.roomId);
    if (error) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not correct!',
        null,
        error,
      );
    }

    //Check if user already joined room
    const isJoined = await this.userRoomsService.isJoined(
      room.id,
      curAccount.id,
    );
    if (isJoined) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'You already joined this room!',
        null,
        null,
      );
    }

    //If private room: user must enter code to join
    if (room.isPrivate && room.code !== roomReq.code) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room Number or Code not correct!',
        null,
        null,
      );
    }

    const [userRoom, err] = await this.userRoomsService.join(room, curAccount);
    if (!userRoom) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Join room failed!',
        null,
        err,
      );
    }
    return new ResponseObject(HttpStatus.OK, 'Join room success!', null, null);
  }

  @Get('users/:roomId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users in room' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async findAllUsersInRoom(@Param('roomId') roomId: string) {
    const isExisted = await this.roomsService.isExisted(roomId);
    if (!isExisted) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not existed!',
        null,
        null,
      );
    }
    const userRooms = await this.userRoomsService.findAllUsersInRoom(roomId);
    if (!userRooms) {
      return new ResponseObject(
        HttpStatus.OK,
        'No users joined this room!',
        null,
        null,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Get all users in room success!',
      userRooms,
      null,
    );
  }

  @Get('rooms/joined')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all rooms that user joined' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.USER)
  async findAllRoomsOfUser(@CurrentAccount() curAccount: Account) {
    return this.userRoomsService.findAllRoomsOfUser(curAccount.id);
  }
}
