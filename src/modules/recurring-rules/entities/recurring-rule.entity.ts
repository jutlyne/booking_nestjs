import { BaseEntity } from '@/common/entities/base.entity';
import { Frequency } from '@prisma/client';

export class RecurringRuleEntity extends BaseEntity {
  frequency: Frequency;
  interval: number;

  weekdays?: string | null;
  dayOfMonth?: number | null;
  repeatUntil?: Date | null;

  constructor(partial: Partial<RecurringRuleEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
