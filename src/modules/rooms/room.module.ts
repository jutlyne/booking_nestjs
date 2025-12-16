import { PrismaService } from '@/databases/prisma.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [],
  providers: [PrismaService],
  exports: [],
})
export class RoomsModule {}
