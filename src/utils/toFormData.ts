/**
 * Convierte un objeto plano o complejo a FormData siguiendo la convención
 * de nombres de .NET para colecciones: Propiedad[index].SubPropiedad
 */
export const toFormData = (obj: unknown, formData: FormData = new FormData(), parentKey: string = ''): FormData => {
  if (obj === null || obj === undefined) return formData;

  if (obj instanceof File) {
    formData.append(parentKey, obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((element, index) => {
      toFormData(element, formData, `${parentKey}[${index}]`);
    });
  } else if (typeof obj === 'object' && !(obj instanceof Date)) {
    const record = obj as Record<string, unknown>;
    Object.keys(record).forEach((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;
      toFormData(record[key], formData, fullKey);
    });
  } else {
    // Para valores primitivos (string, number, boolean)
    formData.append(parentKey, obj.toString());
  }

  return formData;
};