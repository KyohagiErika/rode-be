import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '@accounts/entities/account.entity';
import { RoleEnum } from '@etc/enums';
import { Room } from '@rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { UserRoom } from './entities/user-room.entity';

@Injectable()
export class UserRoomsService {
  constructor(
    @InjectRepository(UserRoom)
    private readonly userRoomsRepository: Repository<UserRoom>,
  ) {}

  async join(room: Room, account: Account) {
    const userRoom = await this.userRoomsRepository.save({
      account,
      room,
    });
    return [userRoom, null];
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
        room: {},
        joinTime: true,
        finishTime: true,
        attendance: true,
      },
    });
    return users;
  }

  async checkAttendance(id: string) {
    const userRoom = await this.userRoomsRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!userRoom) {
      return [null, 'Account not found'];
    }
    userRoom.attendance = !userRoom.attendance;
    await this.userRoomsRepository.save(userRoom);
    return [userRoom, null];
  }
}
