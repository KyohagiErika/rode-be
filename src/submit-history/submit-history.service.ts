import { RoomTypeEnum } from '@etc/enums';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '@rooms/entities/question.entity';
import { Repository } from 'typeorm';
import { SubmitHistory } from './entities/submit-history.entity';
import { Room } from '@rooms/entities/room.entity';

@Injectable()
export class SubmitHistoryService {
  constructor(
    @InjectRepository(SubmitHistory)
    private readonly submitHistoryRepository: Repository<SubmitHistory>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}

  async getByQuestion(question: string) {
    const err = [];
    const checkQuestion = await this.questionRepository.findOne({
      relations: {
        room: true,
      },
      where: {
        id: question,
      },
    });

    let submitHistory: SubmitHistory[] = [];

    if (checkQuestion.room.type == RoomTypeEnum.BE) {
      submitHistory = await this.submitHistoryRepository.find({
        relations: {
          account: true,
        },
        select: {
          account: { fname: true, lname: true },
          score: true,
          time: true,
          submittedAt: true,
        },
        where: {
          question: { id: question },
        },
        order: {
          score: 'DESC',
          time: 'ASC',
          space: 'ASC',
        },
      });
    } else {
      submitHistory = await this.submitHistoryRepository.find({
        relations: {
          account: true,
        },
        select: {
          account: { fname: true, lname: true },
          score: true,
          space: true,
          submittedAt: true,
        },
        where: {
          question: { id: question },
        },
        order: {
          score: 'DESC',
          time: 'ASC',
          space: 'ASC',
        },
      });
    }
    if (!submitHistory) {
      err.push({
        at: 'question',
        message: 'can not find question',
      });
      return [null, err];
    }
    return [submitHistory, err];
  }

  async getByRoom(roomId: string) {
    const room = await this.roomRepository.findOne({
      where: {
        id: roomId,
      },
    });
    if (!room) return [null, 'Room not exist'];
    let submits: SubmitHistory[] = [];
    if (room.type == RoomTypeEnum.FE) {
      submits = await this.submitHistoryRepository.find({
        relations: {
          account: true,
        },
        where: {
          question: { room: { id: roomId } },
        },
        select: {
          account: { id: true, fname: true, lname: true },
          score: true,
          space: true,
          submittedAt: true,
        },
        order: {
          score: 'DESC',
          space: 'ASC',
          submittedAt: 'ASC',
        },
      });
      const checkAccountAppear2times = new Map<string, number>(); //key la id, number la gia tri khi set khac undefined va 0
      const leaderboard = submits.filter((submit) => {
        if (!checkAccountAppear2times.get(submit.account.id)) {
          checkAccountAppear2times.set(submit.account.id, 1);
          return 1;
        }
        return 0;
      });
      return [leaderboard, null];
    } else {
      submits = await this.submitHistoryRepository.find({
        relations: {
          account: true,
        },
        where: {
          question: { room: { id: roomId } },
        },
        select: {
          account: { id: true, fname: true, lname: true },
          score: true,
          time: true,
          submittedAt: true,
        },
        order: {
          // score: 'DESC',
          // time: 'ASC',
          account: { id: 'ASC' },
        },
      });
      const checkSubmitQuestionAppear2times = new Map<string, number>();
      const finishTime = new Map<string, Date>();
      const highestScoresSubmitEachQuestion = submits.filter((submit) => {
        if (!finishTime.get(submit.account.id))
          finishTime.set(submit.account.id, submit.submittedAt);
        else if (finishTime.get(submit.account.id) < submit.submittedAt)
          finishTime.set(submit.account.id, submit.submittedAt);
        if (
          !checkSubmitQuestionAppear2times.get(
            `userId: ${submit.account.id}, questionId: ${submit.question.id}`,
          )
        ) {
          checkSubmitQuestionAppear2times.set(
            `userId: ${submit.account.id}, questionId: ${submit.question.id}`,
            1,
          );
          return 1;
        }
        return 0;
      });
      const highestScoresList = [];
      let totalScore: number = highestScoresSubmitEachQuestion[0].score;
      let totalTime: number = highestScoresSubmitEachQuestion[0].time;
      for (let i = 1; i < highestScoresSubmitEachQuestion.length; i++) {
        if (
          highestScoresSubmitEachQuestion[i].account.id ==
          highestScoresSubmitEachQuestion[i - 1].account.id
        ) {
          totalScore += highestScoresSubmitEachQuestion[i].score;
          totalTime += highestScoresSubmitEachQuestion[i].time;
        } else {
          highestScoresList.push({
            account: {
              fname: highestScoresSubmitEachQuestion[i - 1].account.fname,
              lname: highestScoresSubmitEachQuestion[i - 1].account.lname,
            },
            score: totalScore,
            time: totalTime,
            submittedAt: finishTime.get(
              highestScoresSubmitEachQuestion[i - 1].account.id,
            ),
          });
          totalScore = highestScoresSubmitEachQuestion[i].score;
          totalTime = highestScoresSubmitEachQuestion[i].time;
        }
      }
      return [highestScoresList, null];
    }
  }
}
