import { BaseEntity } from '@/common/entities/base.entity';

export enum Frequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export class RoomBookingOccurrenceEntity extends BaseEntity {
  bookingId: number;

  occurrenceDate: Date;
  startTime: Date;
  endTime: Date;

  constructor(partial: Partial<RoomBookingOccurrenceEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
