const fs = require('fs');
let t = fs.readFileSync('src/utils/exportInvoicePDF.ts', 'utf8');

const regex = /\/\/ Expiration[\s\S]*?doc\.text\("LOGO", 26\.5, 28, { align: 'center' }\);/m;
const repl = `// Expiration
  const expirationDate = new Date(factura.fechaElaboracion || new Date());
  expirationDate.setDate(expirationDate.getDate() + 30);

  const rawLogoUrl = localStorage.getItem('logoUrl') || (token ? getLogoUrlFromToken(token) : null);
  const logoUrl = rawLogoUrl ? (rawLogoUrl.startsWith('http') ? rawLogoUrl : \`\${import.meta.env.VITE_API_URL}\${rawLogoUrl}\`) : null;

  if (logoUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = logoUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const imgData = canvas.toDataURL('image/png');
        
        let targetWidth = 25;
        let targetHeight = 25;
        if (img.width > img.height) {
          targetHeight = (img.height / img.width) * 25;
        } else {
          targetWidth = (img.width / img.height) * 25;
        }
        
        const yOffset = 15 + (25 - targetHeight) / 2;
        const xOffset = 14 + (25 - targetWidth) / 2;

        doc.addImage(imgData, 'PNG', xOffset, yOffset, targetWidth, targetHeight);
      }
    } catch (e) {
      console.error("Error loading logo for PDF", e);
      doc.setDrawColor(226, 232, 240);
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(14, 15, 25, 25, 2, 2, 'FD');
      doc.setFontSize(10);
      doc.setTextColor(148, 163, 184);
      doc.text("LOGO", 26.5, 28, { align: 'center' });
    }
  } else {
    // Header Logo Box Placeholder
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(14, 15, 25, 25, 2, 2, 'FD');
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text("LOGO", 26.5, 28, { align: 'center' });
  }`;

t = t.replace(regex, repl);
fs.writeFileSync('src/utils/exportInvoicePDF.ts', t);
