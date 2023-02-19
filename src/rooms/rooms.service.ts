import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoomTypeEnum } from '../etc/enums';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async getAllRoomTypes() {
    const roomTypes = Object.values(RoomTypeEnum);
    return [roomTypes, null];
  }

  async getAllRooms() {
    const rooms = await this.roomRepository.find();
    return [rooms, null];
  }

  async createOne(info: CreateRoomDto) {
    const room = await this.roomRepository.save({
      code: info.code,
      closeTime: info.closeTime,
      openTime: info.openTime,
      color: info.color,
      duration: info.duration,
      questions: info.questionImages
        ? info.questionImages.map((ele) => ({
            questionImage: ele,
          }))
        : [],
      testCases: info.testCases
        ? info.testCases.map((ele) => ({
            input: ele.input,
            output: ele.output,
          }))
        : [],
      type: info.type,
    });
    return [room, null];
  }

  async findAll() {
    const rooms = await this.roomRepository.find();
    return [rooms, null];
  }

  async findOneById(id: string): Promise<[Room, any]> {
    const room = await this.roomRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        questions: true,
        testCases: true,
      },
    });
    if (!room) {
      return [null, 'Room not found'];
    }
    return [room, null];
  }
}
