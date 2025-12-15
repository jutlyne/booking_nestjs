import { IsNotEmpty, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsExist } from '@/utils/validators/is-exists.validator';
import { lowerCaseTransformer } from '@/utils/transformers/lower-case.transformer';

export class EmailLoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsNotEmpty({
    message: 'emailNotEmpty',
  })
  @Transform(lowerCaseTransformer)
  @Validate(IsExist, ['user'], {
    message: 'emailNotExists',
  })
  email: string;

  @ApiProperty({ example: 'password123' })
  @IsNotEmpty({
    message: 'passwordNotEmpty',
  })
  password: string;
}
