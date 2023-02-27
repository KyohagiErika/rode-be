import { Module } from '@nestjs/common';
import { UserRoomsService } from './user-rooms.service';
import { UserRoomsController } from './user-rooms.controller';
import { RoomsModule } from '@rooms/rooms.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRoom } from './entities/user-room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserRoom]), RoomsModule],
  controllers: [UserRoomsController],
  providers: [UserRoomsService],
})
export class UserRoomsModule {}
