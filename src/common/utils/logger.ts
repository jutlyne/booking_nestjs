import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ClsService } from 'nestjs-cls';
import { Logger as WinstonLogger } from 'winston';

@Injectable()
export class AppLogger {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
    private readonly cls: ClsService,
  ) {}

  log(message: string | number) {
    console.log(`<${this.cls.getId()}> ${message}`);
    this.logger.info(String(message), {
      id: this.cls.getId(),
    });
  }
}
