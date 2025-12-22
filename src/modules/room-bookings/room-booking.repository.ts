import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/databases/prisma.service';
import { CreateRoomBookingDto } from './dto/create-room-booking.dto';
import { endOfDay, startOfDay } from 'date-fns';
import { RoomOccurrenceInput } from './interfaces/room-booking.interface';
import { RecurringRuleCreateInput } from 'generated/prisma/models';

@Injectable()
export class RoomBookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOverlapOccurrence(
    roomId: number,
    occurrence: {
      startTime: Date;
      endTime: Date;
      occurrenceDate: Date;
    },
    excludeId?: number,
  ) {
    return this.prisma.roomBookingOccurrence.findFirst({
      where: {
        booking: {
          roomId,
        },

        occurrenceDate: {
          gte: startOfDay(occurrence.occurrenceDate),
          lte: endOfDay(occurrence.occurrenceDate),
        },

        ...(excludeId && {
          id: { not: excludeId },
        }),

        AND: [
          {
            startTime: {
              lt: occurrence.endTime,
            },
          },
          {
            endTime: {
              gt: occurrence.startTime,
            },
          },
        ],
      },
    });
  }

  async createBookingWithOccurrences(
    dto: CreateRoomBookingDto,
    occurrences: RoomOccurrenceInput[],
    recurringRuleData?: Omit<RecurringRuleCreateInput, 'bookings'>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      let recurringRuleId = null;

      if (dto.isRecurring && recurringRuleData) {
        const rule = await tx.recurringRule.create({
          data: recurringRuleData,
        });
        recurringRuleId = rule.id;
      }

      return await tx.roomBooking.create({
        data: {
          roomId: dto.roomId,
          userId: dto.userId,
          teamId: dto.teamId,
          startTime: new Date(dto.startTime),
          endTime: new Date(dto.endTime),
          isRecurring: dto.isRecurring || false,
          recurringRuleId: recurringRuleId,
          occurrences: {
            create: occurrences.map((occ) => ({
              occurrenceDate: occ.occurrenceDate,
              startTime: occ.startTime,
              endTime: occ.endTime,
            })),
          },
        },
        include: { occurrences: true, recurringRule: true },
      });
    });
  }
}
