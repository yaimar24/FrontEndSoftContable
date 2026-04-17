const fs = require('fs');

let p = 'src/presentation/pages/dashboard/ventas/ListVentas/PaymentModal.tsx';
let v = fs.readFileSync(p, 'utf8');

v = v.replace(/const valorCuota =.*\n\s*const cuotaSugerida =.*/, 'const cuotaSugerida = factura.saldo;');
v = v.replace(/const initialMonto = factura\.esCredito && cuotaSugerida > 0 \? cuotaSugerida\.toString\(\) : factura\.saldo\.toString\(\);/, 'const initialMonto = factura.saldo.toString();');

fs.writeFileSync(p, v);

let p2 = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let v2 = fs.readFileSync(p2, 'utf8');
// remove the references to frecuenciaPagoId and numeroCuotas validation
v2 = v2.replace(/if \(!formData\.frecuenciaPagoId\) newErrors\.frecuenciaPagoId = "Requerido";\n\s*/, '');
v2 = v2.replace(/if \(!formData\.numeroCuotas \|\| formData\.numeroCuotas < 1\) newErrors\.numeroCuotas = "Mín\. 1";\n\s*/, '');

// Also remove the JSX elements for them.
v2 = v2.replace(/<SelectField\s*label="Frecuencia de Pago"[\s\S]*?error=\{errors\.frecuenciaPagoId\}\s*\/>/g, '');
v2 = v2.replace(/<InputField\s*label="Número de Cuotas"[\s\S]*?error=\{errors\.numeroCuotas\}\s*\/>/g, '');

fs.writeFileSync(p2, v2);

// Delete PlanCuotasSection
fs.unlinkSync('src/presentation/components/organisms/PlanCuotasSection.tsx');
