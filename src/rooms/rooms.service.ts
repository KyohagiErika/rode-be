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
      duration: info.duration,
      type: info.type,
      isPrivate: info.isPrivate,
      questions: info.questions.map((question) => ({
        questionImage: question.questionImage,
        maxSubmitTimes: question.maxSubmitTimes,
        colors: question.colors,
        htmlTemplate: question.htmlTemplate,
        testCases: question.testCases.map((testCase) => ({
          input: testCase.input,
          output: testCase.output,
        })),
      })),
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
        questions: {
          testCases: true,
        },
      },
    });
    if (!room) {
      return [null, 'Room not found'];
    }
    return [room, null];
  }

  async findOneByCode(code: string): Promise<[Room, any]> {
    const room = await this.roomRepository.findOne({
      where: {
        code: code,
      },
      relations: {
        questions: true,
      },
    });
    if (!room) {
      return [null, 'Room not found'];
    }
    return [room, null];
  }

  async isExisted(id: string): Promise<boolean> {
    const result = await this.roomRepository.exist({
      where: {
        id,
      },
    });
    return result;
  }
}
