const fs = require('fs');

let p = 'src/presentation/pages/dashboard/ventas/ListVentas/PaymentModal.tsx';
let v = fs.readFileSync(p, 'utf8');

// Find and replace valorCuota line
v = v.split('\n').filter(line => !line.includes('const valorCuota')).join('\n');
v = v.replace(/const cuotaSugerida.*/, 'const cuotaSugerida = factura.saldo;'); 

fs.writeFileSync(p, v);

let p2 = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let v2 = fs.readFileSync(p2, 'utf8');
v2 = v2.split('\n').filter(line => !line.includes('frecuenciaPagoId') && !line.includes('numeroCuotas')).join('\n');
fs.writeFileSync(p2, v2);

console.log("Done");
