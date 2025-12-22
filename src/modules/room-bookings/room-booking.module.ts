import { IsNotExist } from '@/common/utils/validators/is-not-exists.validator';
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/databases/prisma.service';
import { Repository, Services } from '@/common/constants/common';
import { RoomBookingController } from './room-booking.controller';
import { RoomBookingRepository } from './room-booking.repository';
import { RoomBookingService } from './room-booking.service';

@Module({
  controllers: [RoomBookingController],
  providers: [
    {
      provide: Repository.ROOM_BOOKINGS,
      useClass: RoomBookingRepository,
    },
    {
      provide: Services.ROOM_BOOKINGS,
      useClass: RoomBookingService,
    },
    PrismaService,
    IsNotExist,
  ],
  exports: [
    {
      provide: Services.ROOM_BOOKINGS,
      useClass: RoomBookingService,
    },
  ],
})
export class RoomBookingModule {}
