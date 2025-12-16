import { PrismaService } from '@/databases/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
