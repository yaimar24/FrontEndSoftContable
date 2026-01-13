export interface ValidationRule {
  required?: boolean;
  isSelect?: boolean;
  pattern?: RegExp;
  minLength?: number;
  message: string;
}

export type FormRules = Record<string, ValidationRule>;

export const validateForm = (data: any, rules: FormRules) => {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    // Caso: Requerido (String o General)
    if (rule.required && (!value || String(value).trim() === "")) {
      errors[field] = rule.message;
    }

    // Caso: Selectores (Evitar valor 0 o "0")
    if (rule.isSelect && (!value || value === "0" || value === 0)) {
      errors[field] = rule.message;
    }

    // Caso: Patrones (Regex)
    if (rule.pattern && value && !rule.pattern.test(String(value))) {
      errors[field] = rule.message;
    }

    // Caso: Longitud mínima
    if (rule.minLength && String(value).length < rule.minLength) {
      errors[field] = rule.message;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};