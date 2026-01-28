import {
  registerDecorator,
  type ValidationArguments,
  type ValidatorOptions,
} from "class-validator";
// min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export function isStrongPassword(
  regex: RegExp = PASSWORD_REGEX,
  validationOptions?: ValidatorOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "IsStrongPassword",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === "string" && regex.test(value);
        },
        defaultMessage: (args: ValidationArguments) => {
          return `${args.property} is not a strong password.`;
        },
      },
    });
  };
}
