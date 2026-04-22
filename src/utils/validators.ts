export type ValidatorFn = (value: unknown, formData?: Record<string, unknown>) => string | null;

export const validators = {
  required:
    (msg = "Obligatorio"): ValidatorFn =>
    (value) =>
      value === undefined || value === null || value === "" ? msg : null,

  requiredSelect:
    (invalidValue: string | number = "0", msg = "Selecciona una opción"): ValidatorFn =>
    (value) =>
      !value || value === invalidValue ? msg : null,

  minLength:
    (len: number, msg?: string): ValidatorFn =>
    (value) =>
      value && value.length < len ? msg || `Mínimo ${len} caracteres` : null,

  strongPassword:
    (msg = "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial (@$!%*?&)."): ValidatorFn =>
    (value) => {
      if (!value) return null;
      // Expresión regular para contraseña segura
      const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return !strongRegex.test(value) ? msg : null;
    },

  onlyNumbers:
    (msg = "Solo números"): ValidatorFn =>
    (value) =>
      value && !/^\d+$/.test(value) ? msg : null,

  email:
    (msg = "Correo electrónico inválido"): ValidatorFn =>
    (v) =>
      v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? msg : null,
};
