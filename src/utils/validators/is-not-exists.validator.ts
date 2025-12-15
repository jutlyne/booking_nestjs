import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/databases/prisma.service';

type ValidationEntity =
  | {
      id?: number | string;
    }
  | undefined;

@Injectable()
@ValidatorConstraint({ name: 'IsNotExist', async: true })
export class IsNotExist implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const modelName = String(validationArguments.constraints[0]);
    const currentObj = validationArguments.object as ValidationEntity;
    const property = validationArguments.property;

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

    if (entity?.id && currentObj?.id && entity.id === currentObj.id) {
      return true;
    }

    return !entity;
  }

  defaultMessage(validationArguments?: ValidationArguments) {
    if (validationArguments) {
      return `${validationArguments.property} already exists`;
    }

    return 'already exists';
  }
}
