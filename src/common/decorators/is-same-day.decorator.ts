import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isSameDay, parseISO } from 'date-fns';

@ValidatorConstraint({ name: 'isSameDay', async: false })
export class IsSameDayConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as any)[relatedPropertyName];

    if (!value || !relatedValue) return false;

    const date1 = typeof value === 'string' ? parseISO(value) : value;
    const date2 =
      typeof relatedValue === 'string' ? parseISO(relatedValue) : relatedValue;

    return isSameDay(date1, date2);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} phải cùng ngày với ${args.constraints[0]}`;
  }
}

export function IsSameDay(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsSameDayConstraint,
    });
  };
}
