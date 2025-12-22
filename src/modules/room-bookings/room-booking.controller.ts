import { Routes, Services } from '@/common/constants/common';
import { RoomBookingService } from './room-booking.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { Body, Controller, Inject, Post } from '@nestjs/common';

@Controller(Routes.ROOM_BOOKINGS)
export class RoomBookingController {
  constructor(
    @Inject(Services.ROOM_BOOKINGS)
    private readonly service: RoomBookingService,
  ) {}

  @Post()
  async create(@Body() dto: CreateRoomBookingDto) {
    return await this.service.createBooking(dto);
  }
}
