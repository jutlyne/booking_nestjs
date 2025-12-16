import { Exclude } from 'class-transformer';

export class BaseEntity {
  id: number;

  createdAt?: Date;
  updatedAt?: Date;

  @Exclude()
  deletedAt?: Date;

  constructor(partial?: Partial<BaseEntity>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
