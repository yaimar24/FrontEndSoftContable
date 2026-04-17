const fs = require('fs');
const p = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let v = fs.readFileSync(p, 'utf8');

// 1. Remove state const [condicionPago, setCondicionPago] = useState<'CREDITO' | 'CONTADO'>('CONTADO');
v = v.replace(/const \[condicionPago, setCondicionPago\] = useState<[^>]+>\('CONTADO'\);\s*/g, '');

// 2. Remove the first submit condition if (condicionPago === 'CONTADO')
v = v.replace(/if \(condicionPago === 'CONTADO'\) \{\s*if \(\!formData\.pagos \|\| formData\.pagos\.length === 0\) \{\s*toast\.error[^}]+\}\s*\}/, 
"if (!formData.pagos || formData.pagos.length === 0) {\n        toast.error('Debe configurar al menos un pago de contado');\n        return;\n      }");

// 3. Remove the entire useEffect that watches condicionPago
v = v.replace(/\/\/ Efecto para reinicializar pagos.*\n\s*useEffect\(\(\) => \{[\s\S]*?\}, \[condicionPago, currentTotal, formData\.esCredito, parametrosFacturacion\.mediosPago\]\);/g, '');

// But let's check what exactly that effect did so we can keep the CONTADO part.
// Actually, I'll do this safely.
fs.writeFileSync('clean_compras_tmp.cjs', v);
