import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@accounts/entities/account.entity';
import { RoleEnum } from '@etc/enums';
import { Room } from '@rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { UserRoom } from './entities/user-room.entity';
import { Log } from '@logger/logger.decorator';
import { LogService } from '@logger/logger.service';

@Injectable()
export class UserRoomsService {
  constructor(
    @Log('UserRoomsService') private readonly logger: LogService,
    @InjectRepository(UserRoom)
    private readonly userRoomsRepository: Repository<UserRoom>,
  ) {}

  async join(room: Room, account: Account) {
    if (room.openTime < new Date() && room.closeTime > new Date()) {
      const userRoom = await this.userRoomsRepository.save({
        account,
        room,
      });
      return [userRoom, null];
    } else return [null, 'Room is not opened!'];
  }

  async isJoined(roomId: string, accountId: string) {
    const userRoom = await this.userRoomsRepository.findOne({
      where: {
        room: {
          id: roomId,
        },
        account: {
          id: accountId,
          role: RoleEnum.USER,
        },
      },
    });
    return userRoom ? true : false;
  }

  async findAllUsersInRoom(roomId: string) {
    const users = await this.userRoomsRepository.find({
      where: {
        room: {
          id: roomId,
        },
        account: {
          role: RoleEnum.USER,
        },
      },
      relations: {
        account: true,
      },
      select: {
        account: {
          id: true,
          fname: true,
          lname: true,
          email: true,
          studentId: true,
          phone: true,
          dob: true,
        },
        joinTime: true,
        finishTime: true,
        attendance: true,
      },
    });
    return users;
  }

  async findAllRoomsOfUser(accountId: string) {
    const users = await this.userRoomsRepository.find({
      where: {
        account: {
          id: accountId,
          role: RoleEnum.USER,
        },
      },
      relations: {
        room: true,
      },
      select: {
        room: {
          id: true,
          openTime: true,
          closeTime: true,
          duration: true,
          type: true,
        },
        joinTime: true,
        finishTime: true,
      },
    });
    return users;
  }
}
