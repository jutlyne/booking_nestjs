import { BaseEntity } from '@/common/entities/base.entity';
import { Exclude } from 'class-transformer';

export class RoomEntity extends BaseEntity {
  name: string;

  @Exclude()
  locationId: number;

  constructor(partial: Partial<RoomEntity>) {
    super(partial);
    Object.assign(this, partial);
  }
}
