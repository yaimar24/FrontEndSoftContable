import type { ValidatorFn } from "./validators";

type Schema<T> = {
  [K in keyof T]?: ValidatorFn[];
};

export const validateForm = <T extends Record<string, any>>(
  formData: T,
  schema: Schema<T>
) => {
  const errors: Partial<Record<keyof T, string>> = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const value = formData[field as keyof T];

    for (const rule of rules ?? []) {
      const error = rule(value, formData);
      if (error) {
        errors[field as keyof T] = error;
        break;
      }
    }
  });

  return errors;
};
