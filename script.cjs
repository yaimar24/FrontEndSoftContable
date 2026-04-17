const fs = require('fs');
let p = 'src/presentation/pages/dashboard/compras/CreateCompras/CreateCompras.tsx';
let txt = fs.readFileSync(p, 'utf8');

// Change the options of SelectField for condicionPago
txt = txt.replace(
  /options=\{\[\s*\{\s*id:\s*'CONTADO',\s*nombre:\s*'.*?'\s*\},\s*\{\s*id:\s*'CREDITO',\s*nombre:\s*'.*?'\s*\}\s*\]\}/g,
  "options={[{ id: 'CONTADO', nombre: 'De Contado (Pago Total)' }]} disabled"
);

// Remove the CREDITO rendering logic
let renderRegex = /\{condicionPago\s*===\s*'CREDITO'\s*\?\s*\([\s\S]*?\)\s*:\s*\(/;
let newRender = "(";
txt = txt.replace(renderRegex, newRender);

// Replace the closing of the CONDITION block (the final matching parenthesis and bracket)
// Since it's '(...  : (... )', replacing the first half and leaving the rest doesn't balance if we don't remove the closing.
// Actually it's easier to just do text replacement directly:
