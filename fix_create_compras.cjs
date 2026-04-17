const fs = require('fs');
let p = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let v = fs.readFileSync(p, 'utf8');

// Replace {condicionPago === 'CREDITO' ? ( ... ) : ( ... )}
// The block ends at standard div wrappers. Let's look for it manually using a RegExp that grabs everything between the ternary and the map of pagos.
const replaceExp = /\{condicionPago === 'CREDITO' \? \([\s\S]*?\) : \(/;
if (replaceExp.test(v)) {
    v = v.replace(replaceExp, '(');
}

// Remove the remaining )} before closing the section
const closingExp = /<\/div>\s*\)\}\s*<\/section>/;
if (closingExp.test(v)) {
    v = v.replace(closingExp, '</div>\n          </section>');
}

// Ensure the CREDIT logic is fully gone. Also replace the remaining )} if they exist.
fs.writeFileSync(p, v);
