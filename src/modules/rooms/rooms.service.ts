import { Inject, Injectable } from '@nestjs/common';
import { RoomsRepository } from './rooms.repository';
import { Repository } from '@/common/constants/common';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(Repository.ROOMS) private readonly repo: RoomsRepository,
  ) {}
}
