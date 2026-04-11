const fs = require('fs');
const file = 'src/presentation/pages/contabilidad/ContabilidadNuevoPage.tsx';
let content = fs.readFileSync(file, 'utf-8');

const regexTotales = /const totales = useMemo\(\(\) => \{\s*return movimientos\.reduce\([\s\S]*?\}, \[movimientos\]\);/;
const regexValid = /const isCuadrado = Math\.abs.*?const isValid =.*?;/s;

const newTotalesAndValid = `const validMovimientos = movimientos.filter(m => m.cuentaCodigo && (Number(m.debito) > 0 || Number(m.credito) > 0));
  
  const totales = useMemo(() => {
    return validMovimientos.reduce(
      (acc, curr) => ({
        debito: acc.debito + (Number(curr.debito) || 0),
        credito: acc.credito + (Number(curr.credito) || 0)
      }),
      { debito: 0, credito: 0 }
    );
  }, [validMovimientos]);

  const isValid = validMovimientos.length >= 2 && Math.abs(totales.debito - totales.credito) < 0.01 && totales.debito > 0;`;

content = content.replace(regexTotales, '');
content = content.replace(regexValid, newTotalesAndValid);

const saveRegex = /movimientos\.map\(m => \(\{/g;
content = content.replace(saveRegex, 'validMovimientos.map(m => ({');

fs.writeFileSync(file, content);