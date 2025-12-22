import { Repository } from '@/common/constants/common';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RoomBookingRepository } from './room-booking.repository';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { addDays, addMonths, isBefore, format } from 'date-fns';
import { Frequency } from '@prisma/client';
import { RecurringRuleCreateInput } from 'generated/prisma/models';

@Injectable()
export class RoomBookingService {
  constructor(
    @Inject(Repository.ROOM_BOOKINGS)
    private readonly repo: RoomBookingRepository,
  ) {}

  async createBooking(dto: CreateRoomBookingDto) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    const plannedOccurrences = this.generateOccurrences(start, end, dto);

    for (const occ of plannedOccurrences) {
      const conflict = await this.repo.findOverlapOccurrence(dto.roomId, occ);
      if (conflict) {
        throw new BadRequestException(
          `Phòng đã bận vào ngày ${format(occ.occurrenceDate, 'dd/MM/yyyy')} (${format(occ.startTime, 'HH:mm')} - ${format(occ.endTime, 'HH:mm')})`,
        );
      }
    }

    const recurringRuleData = dto.isRecurring
      ? ({
          frequency: dto.frequency,
          interval: dto.interval ?? 1,
          weekdays: dto.weekdays?.join(','),
          repeatUntil: dto.repeatUntil ? new Date(dto.repeatUntil) : null,
        } as RecurringRuleCreateInput)
      : undefined;

    return await this.repo.createBookingWithOccurrences(
      dto,
      plannedOccurrences,
      recurringRuleData,
    );
  }

  private generateOccurrences(
    start: Date,
    end: Date,
    dto: CreateRoomBookingDto,
  ) {
    const occurrences = [];
    if (!dto.isRecurring) {
      occurrences.push({
        occurrenceDate: start,
        startTime: start,
        endTime: end,
      });
      return occurrences;
    }

    let currStart = new Date(start);
    let currEnd = new Date(end);
    const limit = dto.repeatUntil
      ? new Date(dto.repeatUntil)
      : addMonths(start, 1);

    while (isBefore(currStart, limit)) {
      if (dto.frequency === Frequency.weekly && dto.weekdays) {
        if (dto.weekdays.includes(currStart.getDay())) {
          occurrences.push({
            occurrenceDate: new Date(currStart),
            startTime: new Date(currStart),
            endTime: new Date(currEnd),
          });
        }
      } else {
        occurrences.push({
          occurrenceDate: new Date(currStart),
          startTime: new Date(currStart),
          endTime: new Date(currEnd),
        });
      }

      if (dto.frequency === Frequency.daily) {
        currStart = addDays(currStart, dto.interval ?? 1);
        currEnd = addDays(currEnd, dto.interval ?? 1);
      } else if (dto.frequency === Frequency.weekly) {
        currStart = addDays(currStart, 1);
        currEnd = addDays(currEnd, 1);
      } else if (dto.frequency === Frequency.monthly) {
        currStart = addMonths(currStart, dto.interval ?? 1);
        currEnd = addMonths(currEnd, dto.interval ?? 1);
      }
    }
    return occurrences;
  }
}
