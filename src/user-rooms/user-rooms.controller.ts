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
  Logger,
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
import { CheckAttendanceDto } from './dtos/check-attendance.dto';
import { UserRoom } from './entities/user-room.entity';
import { JoinRoomDTO } from './dtos/join-room.dto';

@Controller('user-rooms')
@ApiTags('UserRooms')
export class UserRoomsController {
  private readonly logger = new Logger(UserRoomsController.name);
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
    @Body() joinRoomDTO: JoinRoomDTO,
    @CurrentAccount() curAccount: Account,
  ) {
    this.logger.log(
      `User ${curAccount.email} is joining room ${joinRoomDTO.roomId}`,
    );
    const [room, error] = await this.roomsService.findOneById(
      joinRoomDTO.roomId,
    );
    this.logger.log(`Room ${joinRoomDTO.roomId} has been found`);
    if (error) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not correct!',
        null,
        error,
      );
    }

    this.logger.log('Check if user already joined room');
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

    this.logger.log('Check if private room: user must enter code to join');
    if (room.isPrivate && room.code !== joinRoomDTO.code) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room Number or Code not correct!',
        null,
        null,
      );
    }

    this.logger.log('Check if room is opened and then join');
    const [userRoom, err] = await this.userRoomsService.join(room, curAccount);
    if (!userRoom) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Join room failed!',
        null,
        err,
      );
    }
    this.logger.log('Join room success');
    return new ResponseObject(HttpStatus.OK, 'Join room success!', null, null);
  }

  @Get('users/:roomId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users in room' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async findAllUsersInRoom(@Param('roomId') roomId: string) {
    this.logger.log(`Get all users in room ${roomId}`);
    const isExisted = await this.roomsService.isExisted(roomId);
    if (!isExisted) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not existed!',
        null,
        null,
      );
    }
    this.logger.log('Room is existed!');
    const userRooms = await this.userRoomsService.findAllUsersInRoom(roomId);
    if (!userRooms) {
      return new ResponseObject(
        HttpStatus.OK,
        'No users joined this room!',
        null,
        null,
      );
    }
    this.logger.log('Get all users in room success!');
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
    this.logger.log(`Get all rooms that user ${curAccount.email} joined`);
    return this.userRoomsService.findAllRoomsOfUser(curAccount.id);
  }

  @Post('check-attendance/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check Attendance for Users' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async checkAttendance(@Body() info: CheckAttendanceDto) {
    let results = [];
    for (var i = 0; i < info.id.length; i++) {
      this.logger.log(`Checking attendance for user ${info.id[i]}`);
      const [check, err] = await this.userRoomsService.checkAttendance(
        info.id[i],
      );
      results.push([check, err]);
    }
    if (!results) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Check Attendance failed!',
        null,
        results,
      );
    }
    this.logger.log('Check attendance success!');
    return new ResponseObject(
      HttpStatus.OK,
      'Check Attendance success!',
      results,
      null,
    );
  }
}
