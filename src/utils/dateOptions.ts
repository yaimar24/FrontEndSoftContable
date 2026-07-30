export const getYears = (
  startYear: number = 2020,
  yearsAhead: number = 10
): number[] => {
  const currentYear = new Date().getFullYear();

  return Array.from(
    { length: currentYear - startYear + yearsAhead + 1 },
    (_, i) => startYear + i
  );
};

export const months = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];