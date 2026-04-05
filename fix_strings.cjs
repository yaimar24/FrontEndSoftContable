const fs = require('fs');
let t = fs.readFileSync('src/utils/exportInvoicePDF.ts', 'utf8');

t = t.replace('Record<string, string>', 'any');
t = t.replace('Mi InstituciÃ³n', 'Mi Institución');
t = t.replace('const telefono = perfilInstitucional.telefono || \'N/A\';\r\n  const direccion = perfilInstitucional.direccion || \'N/A\';', 'const telefono = perfilInstitucional.telefono || \'N/A\';\n  const direccion = perfilInstitucional.direccion || \'N/A\';\n  const regimenIva = perfilInstitucional.regimenIva?.nombre || \'N/A\';');
t = t.replace('TelÃ©fono:', 'Teléfono:');
t = t.replace('DirecciÃ³n:', 'Dirección:');
t = t.replace('NIT: ${nit}', 'NIT: ${nit} - Responsable de IVA: ${regimenIva}');

fs.writeFileSync('src/utils/exportInvoicePDF.ts', t);