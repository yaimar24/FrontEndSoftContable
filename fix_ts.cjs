const fs = require('fs');
let p = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let v = fs.readFileSync(p, 'utf8');

// Replace the stray )} with nothing
v = v.replace(/<\/div>\s*\)\}\s*<\/section>/, "</div>\n          </section>");

fs.writeFileSync(p, v);
