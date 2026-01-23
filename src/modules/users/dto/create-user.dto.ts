import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '@/common/utils/transformers/lower-case.transformer';
import { IsNotExist } from '@/common/utils/validators/is-not-exists.validator';
import { UserErrorCode } from '@/common/errors/error-codes';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @Transform(lowerCaseTransformer)
  @IsNotEmpty({ message: UserErrorCode.EMAIL_ALREADY_EXISTS })
  @Validate(IsNotExist, ['user'], {
    message: UserErrorCode.EMAIL_ALREADY_EXISTS,
  })
  @IsEmail({}, { message: UserErrorCode.EMAIL_ALREADY_EXISTS })
  email: string;

  @ApiProperty({ example: 'password123', minLength: 6 })
  @MinLength(6, { message: UserErrorCode.PASSWORD_TOO_SHORT })
  password: string;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  fullname?: string;

  @ApiPropertyOptional({ example: 1234567890 })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'avatar.png' })
  @IsOptional()
  @IsString()
  avatar?: string | null;
}
