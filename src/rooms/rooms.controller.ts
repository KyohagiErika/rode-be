import { Controller } from '@nestjs/common';
import { Body, Get, Post, UseGuards } from '@nestjs/common/decorators';
import { HttpStatus } from '@nestjs/common/enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import ResponseObject from '../etc/response-object';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import Roles from '../decorators/roles.decorator';
import { RoleEnum } from '../etc/enums';
import { CreateRoomDto } from './dtos/create-room.dto';
import { RoomsService } from './rooms.service';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
@ApiTags('rooms')
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('get-all-room-type')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getAllRoomType() {
    const [roomTypes, err] = await this.roomsService.getAllRoomTypes();
    if (!roomTypes) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get all room types failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Get all room types success!', roomTypes, null);
  }

  @Post('create-one')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async createOne(@Body() info: CreateRoomDto) {
    const [room, err] = await this.roomsService.createOne(info);
    if (!room) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Create room failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Create room success!', room, null);
  }

  @Get('get-all')
  @UseGuards(RoleGuard)
  @Roles(RoleEnum.ADMIN)
  async getAll() {
    const [rooms, err] = await this.roomsService.findAll();
    if (!rooms) {
      return new ResponseObject(HttpStatus.BAD_REQUEST, 'Get all rooms failed!', null, err);
    }
    return new ResponseObject(HttpStatus.OK, 'Get all rooms success!', rooms, null);
  }
}
