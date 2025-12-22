import { Frequency } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
} from 'class-validator';
import { IsSameDay } from '@/common/decorators/is-same-day.decorator';

export class CreateRoomBookingDto {
  @ApiProperty({ description: 'ID của phòng đặt', example: 1 })
  @IsInt()
  @IsNotEmpty()
  roomId: number;

  @ApiProperty({
    description: 'ID của người dùng thực hiện đặt phòng',
    example: 101,
  })
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @ApiPropertyOptional({
    description: 'ID của nhóm (nếu đặt cho team)',
    example: 5,
  })
  @IsInt()
  @IsOptional()
  teamId?: number;

  @ApiProperty({
    description: 'Thời gian bắt đầu (ISO 8601)',
    example: '2023-12-25T08:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startTime: string;

  @ApiProperty({
    description: 'Thời gian kết thúc (ISO 8601)',
    example: '2023-12-25T09:00:00Z',
  })
  @IsDateString()
  @IsNotEmpty()
  @IsSameDay('startTime', {
    message: 'Thời gian bắt đầu và kết thúc phải trong cùng một ngày',
  })
  endTime: string;

  @ApiPropertyOptional({
    description: 'Có phải là lịch lặp lại hay không?',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isRecurring?: boolean;

  @ApiPropertyOptional({
    description: 'Tần suất lặp lại',
    enum: Frequency,
    example: Frequency.weekly,
  })
  @IsEnum(Frequency)
  @IsOptional()
  frequency?: Frequency;

  @ApiPropertyOptional({
    description: 'Khoảng cách giữa các lần lặp (ví dụ: mỗi 2 tuần)',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  interval?: number;

  @ApiPropertyOptional({
    description: 'Các thứ trong tuần (0: Chủ nhật, 1: Thứ hai,...)',
    type: [Number],
    example: [1, 3, 5],
  })
  @IsArray()
  @IsOptional()
  weekdays?: number[];

  @ApiPropertyOptional({
    description: 'Ngày kết thúc việc lặp lại (ISO 8601)',
    example: '2024-01-25T23:59:59Z',
  })
  @IsDateString()
  @IsOptional()
  repeatUntil?: string;
}
