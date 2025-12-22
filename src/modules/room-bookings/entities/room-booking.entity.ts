import { BaseEntity } from '@/common/entities/base.entity';
import { RoomBookingOccurrenceEntity } from '@/modules/occurrences/entities/occurrence.entity';
import { RecurringRuleEntity } from '@/modules/recurring-rules/entities/recurring-rule.entity';

export class RoomBookingEntity extends BaseEntity {
  roomId: number;
  userId: number;
  teamId?: number | null;

  startTime: Date;
  endTime: Date;

  isRecurring: boolean;
  recurringRuleId?: number | null;

  recurringRule?: RecurringRuleEntity;
  occurrences?: RoomBookingOccurrenceEntity[];

  constructor(partial: Partial<RoomBookingEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
