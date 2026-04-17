const fs = require('fs');
let content = fs.readFileSync('src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx', 'utf8');

// 1) Remove the toggle switch for 'Condición de Pago', since we only want CONTADO.
const conditionBlockRegex = /<SelectField\s*label="Condición de Pago"\s*name="condicionPago"[\s\S]*?displayExpr=\{\(item\) => item\.nombre\}\s*\/>/;
content = content.replace(conditionBlockRegex, '');

// 2) Remove the container div around the toggle
content = content.replace(/<div className="mb-6 border-b border-slate-100 pb-6">\s*<\/div>/, '');

// 3) Replace the ternary starting with {condicionPago === 'CREDITO' ? ( 
// that contains Frecuencia de Pago and Número de Cuotas with just the pagos array mapping (the else block).
const ternaryRegex = /\{condicionPago === 'CREDITO' \? \([\s\S]*?\) : \(/;
content = content.replace(ternaryRegex, '(');

// remove the trailing )} inside <section className="tuto-compra-pagos ...">
const trailingRegex = /<\/div>\s*\)\}\s*<\/section>/;
content = content.replace(trailingRegex, '</div>\n          </section>');

// 4) Inside the code, we had:
// const [condicionPago, setCondicionPago] = useState<'CREDITO' | 'CONTADO'>('CONTADO');
content = content.replace(/const \[condicionPago, setCondicionPago\] = useState<'CREDITO' \| 'CONTADO'>\('CONTADO'\);/, '');

// 5) Inside handleSubmit:
// if (condicionPago === 'CONTADO') { ... } -> just keep its content since we are always contado.
content = content.replace(/if \(condicionPago === 'CONTADO'\) \{\s*if \(!formData\.pagos \|\| formData\.pagos\.length === 0\) \{\s*toast\.error\("Debe configurar al menos un pago de contado"\);\s*return;\s*\}\s*\}/, 
if (!formData.pagos || formData.pagos.length === 0) {
        toast.error("Debe configurar al menos un pago de contado");
        return;
      });

// 6) The effect that depended on condicionPago:
// This initializes ormData.pagos correctly based on the total. It used to check if (condicionPago === 'CONTADO' && !formData.esCredito).
content = content.replace(/if \(condicionPago === 'CONTADO' && !formData\.esCredito\) \{/, 'if (!formData.esCredito) {');
content = content.replace(/\} else if \(condicionPago === 'CREDITO'\) \{\s*handlePagosChange\(\[\]\);\s*handleChange\(\{ target: \{ name: 'medioPagoId', value: null \} \} as any\);\s*\}/, '');
content = content.replace(/, \[condicionPago, currentTotal, formData\.esCredito, parametrosFacturacion\.mediosPago\]\);/, ', [currentTotal, formData.esCredito, parametrosFacturacion.mediosPago]);');


fs.writeFileSync('src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx', content);
console.log("Updated");
