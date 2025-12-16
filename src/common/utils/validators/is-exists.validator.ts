import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/databases/prisma.service';

@Injectable()
@ValidatorConstraint({ name: 'IsExist', async: true })
export class IsExist implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: any, validationArguments: ValidationArguments) {
    const modelName = String(validationArguments.constraints[0]);
    const pathToProperty = validationArguments.constraints[1] as
      | string
      | undefined;

    const property = pathToProperty || validationArguments.property;

    const modelMap: Record<string, any> = {
      user: this.prisma.user,
      team: this.prisma.team,
      room: this.prisma.room,
    };

    const modelDelegate = modelMap[modelName];
    if (!modelDelegate) {
      throw new Error(`Model ${modelName} not found in PrismaService`);
    }

    const entity = await modelDelegate.findFirst({
      where: { [property]: value },
    });

    return Boolean(entity);
  }

  defaultMessage(validationArguments?: ValidationArguments) {
    return validationArguments
      ? `${validationArguments.property} does not exist`
      : 'Value does not exist';
  }
}
