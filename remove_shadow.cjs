const fs = require('fs');
let content = fs.readFileSync('src/components/pages/dashboard/ventas/VentasViewerPage.tsx', 'utf8');

content = content.replace(/shadow-xl/g, 'shadow-none');
content = content.replace(/drop-shadow-sm/g, 'drop-shadow-none');

fs.writeFileSync('src/components/pages/dashboard/ventas/VentasViewerPage.tsx', content, 'utf8');

let invContent = fs.readFileSync('src/components/pages/dashboard/ventas/ListVentas/InvoiceTemplate.tsx', 'utf8');
invContent = invContent.replace(/drop-shadow-sm/g, 'drop-shadow-none');
fs.writeFileSync('src/components/pages/dashboard/ventas/ListVentas/InvoiceTemplate.tsx', invContent, 'utf8');

console.log('Shadows removed!');
