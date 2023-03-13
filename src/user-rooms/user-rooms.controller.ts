import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpStatus,
  Body,
} from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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

@Controller('user-rooms')
@ApiTags('UserRooms')
export class UserRoomsController {
  constructor(
    private readonly userRoomsService: UserRoomsService,
    private readonly roomsService: RoomsService,
  ) {}

  @Post('join/:roomId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.USER)
  async join(
    @Param('roomId') roomId: string,
    @CurrentAccount() curAccount: Account,
  ) {
    const [room, error] = await this.roomsService.findOneById(roomId);
    if (error) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Room not existed!',
        null,
        error,
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
    return new ResponseObject(
      HttpStatus.OK,
      'Join room success!',
      userRoom,
      null,
    );
  }

  @Get('users/room/:roomId')
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.USER)
  async findAllRoomsOfUser(@CurrentAccount() curAccount: Account) {
    return this.userRoomsService.findAllRoomsOfUser(curAccount.id);
  }

  @Post('check-attendance/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async checkAttendance(@Body() info: CheckAttendanceDto) {
    let results = [];
    for( var i=0; i<info.id.length; i++){
      const [check, err] = await this.userRoomsService.checkAttendance(info.id[i]);
      results.push([check, err] )
    }
    if (!results) {
      return new ResponseObject(
        HttpStatus.BAD_REQUEST,
        'Check Attendance failed!',
        null,
        results,
      );
    }
    return new ResponseObject(
      HttpStatus.OK,
      'Check Attendance success!',
      results,
      null,
    );
  
    }
    
}
