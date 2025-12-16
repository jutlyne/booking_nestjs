import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(message: string = 'forbidden') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
