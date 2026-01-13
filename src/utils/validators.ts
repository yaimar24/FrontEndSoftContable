export type ValidatorFn = (value: any, formData?: any) => string | null;

export const validators = {
  required:
    (msg = "Obligatorio"): ValidatorFn =>
    (value) =>
      value === undefined || value === null || value === "" ? msg : null,

  requiredSelect:
    (invalidValue: any = "0", msg = "Selecciona una opción"): ValidatorFn =>
    (value) =>
      !value || value === invalidValue ? msg : null,

  minLength:
    (len: number, msg?: string): ValidatorFn =>
    (value) =>
      value && value.length < len ? msg || `Mínimo ${len} caracteres` : null,

  onlyNumbers:
    (msg = "Solo números"): ValidatorFn =>
    (value) =>
      value && !/^\d+$/.test(value) ? msg : null,

  email:
    (msg = "Correo electrónico inválido"): ValidatorFn =>
    (v) =>
      v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? msg : null,
};
