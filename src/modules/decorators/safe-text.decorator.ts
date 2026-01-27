import { registerDecorator } from "class-validator";

import type { ValidationArguments, ValidationOptions } from "class-validator";

/**
 * Allows:
 * - letters, numbers
 * - spaces, newlines
 * - common punctuation
 * - markdown symbols (* _ # > - `)
 *
 * Disallows:
 * - any HTML tags
 * - script-like injections
 */
const SAFE_TEXT_REGEX = /^[a-zA-Z0-9\s.,!?'"()\-_:;#*_>`~\[\]\n\r]+$/;

export function IsSafeText(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isSafeText",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          if (typeof value !== "string") return false;

          // Block HTML tags explicitly
          if (/<\/?[a-z][\s\S]*>/i.test(value)) return false;

          return SAFE_TEXT_REGEX.test(value);
        },

        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains unsafe or invalid characters`;
        },
      },
    });
  };
}
