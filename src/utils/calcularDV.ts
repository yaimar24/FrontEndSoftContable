export const calcularDV = (nit: string): number => {
  if (!nit || isNaN(Number(nit))) return 0;
  const vpri = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
  let x = 0;
  const z = nit.length;
  for (let i = 0; i < z; i++) {
    x += Number(nit.charAt(i)) * vpri[z - 1 - i];
  }
  const y = x % 11;
  return y > 1 ? 11 - y : y;
};