import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { FacturaVentaReadDTO } from "../models/Venta";
import type { FacturaCompraReadDTO } from "../models/FacturaCompra";
import { getNombreColegioFromToken, getLogoUrlFromToken } from "./jwt";

export const exportInvoiceToPDF = async (factura: FacturaVentaReadDTO | FacturaCompraReadDTO, token: string | null) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  
  let perfilInstitucional: any = {};
  try {
    const storedPerfil = localStorage.getItem('perfilInstitucional');
    if (storedPerfil) perfilInstitucional = JSON.parse(storedPerfil);
  } catch (e) {
    console.error("Error parsing perfil", e);
  }
  
  const nombreColegio = perfilInstitucional.nombreColegio || (token ? getNombreColegioFromToken(token) : null) || "Mi Institución";
  const nit = perfilInstitucional.nit || perfilInstitucional.identificacion || 'N/A';
  const telefono = perfilInstitucional.telefono || 'N/A';
  const direccion = perfilInstitucional.direccion || 'N/A';
  const regimenIva = perfilInstitucional.regimenIva?.nombre || 'N/A';
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(date);
  };
  
  const formatCurrency = (val?: number) => (val || 0).toLocaleString('es-CO', { style: 'currency', currency: 'COP' });

  // Expiration
  const expirationDate = new Date(factura.fechaElaboracion || new Date());
  expirationDate.setDate(expirationDate.getDate() + 30);

  const rawLogoUrl = localStorage.getItem('logoUrl') || (token ? getLogoUrlFromToken(token) : null);
  const logoUrl = rawLogoUrl ? (rawLogoUrl.startsWith('http') ? new URL(new URL(rawLogoUrl).pathname, window.location.origin).toString() : rawLogoUrl) : null;

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
  }

  // Type Checks
  const isCompra = 'proveedorNombre' in factura;
  const docTitle = isCompra ? "COMPRA" : "VENTA";
  const entityTitle = isCompra ? "PROVEEDOR" : "FACTURAR A";
  const entityNombreBase = isCompra ? (factura as FacturaCompraReadDTO).proveedorNombre || "Proveedor General" : (factura as FacturaVentaReadDTO).clienteNombre || "Cliente General";
  const entityId = isCompra ? (factura as FacturaCompraReadDTO).proveedorId : (factura as FacturaVentaReadDTO).clienteId;
  const entityTelefono = isCompra ? (factura as FacturaCompraReadDTO).proveedorTelefono : (factura as FacturaVentaReadDTO).clienteTelefono;
  const entityDireccion = isCompra ? (factura as FacturaCompraReadDTO).proveedorDireccion : (factura as FacturaVentaReadDTO).clienteDireccion;
  const numColor = isCompra ? [79, 70, 229] : [37, 99, 235]; // indigo for COMPRA, blue for VENTA
  const medioPagoStr = isCompra ? ((factura as FacturaCompraReadDTO).medioPagoNombre || (factura as FacturaCompraReadDTO).medioPagoCodigo || "N/A") : "N/A";

  // Header Title
  doc.setTextColor(30, 58, 138); // blue-900
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text(nombreColegio.toUpperCase(), 45, 22);
  
  doc.setTextColor(100, 116, 139); // slate-500
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`NIT: ${nit} - Responsable de IVA: ${regimenIva}`, 45, 28);
  doc.text(`Teléfono: ${telefono} | Dir: ${direccion}`, 45, 33);
  
  // Invoice Number
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(docTitle, 195, 25, { align: 'right' });
  
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(155, 28, 40, 15, 2, 2, 'FD');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(`${docTitle} N°`, 158, 33);
  doc.setTextColor(numColor[0], numColor[1], numColor[2]);
  doc.setFontSize(14);
  doc.text(factura.numero || "000", 158, 40);
  
  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 48, 196, 48);
  
  // Client/Provider Info block
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(241, 245, 249);
  doc.roundedRect(14, 55, 80, 28, 3, 3, 'FD');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.text(entityTitle, 18, 61);
  doc.line(18, 63, 90, 63);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  let entityNombre = entityNombreBase;
  if (entityNombre.length > 25) entityNombre = entityNombre.substring(0, 25) + "...";
  doc.text(entityNombre, 18, 68);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`ID / NIT: ${entityId || 'N/A'}`, 18, 72);
  doc.text(`Teléfono: ${entityTelefono || 'N/A'}`, 18, 76);
  let entityDir = entityDireccion || 'N/A';
  if (entityDir.length > 35) entityDir = entityDir.substring(0, 35) + "...";
  doc.text(`Dirección: ${entityDir}`, 18, 80);

  // Dates Info Block
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(100, 55, 96, 28, 3, 3, 'FD');
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("FECHA EXPEDICIÓN", 105, 61);
  doc.text("FECHA VENCIMIENTO", 105, 71);
  doc.text("MEDIO DE PAGO", 155, 61);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.text(formatDate(factura.fechaElaboracion), 105, 65);
  doc.text(formatDate(expirationDate.toISOString()), 105, 75);
  doc.text(medioPagoStr, 155, 65);

  // Table Items
  const tableBody = (factura.detalles || []).map((det, idx) => [
    det.productoId?.substring(0, 8) || (idx + 1).toString().padStart(3, '0'),
    det.productoNombre || det.descripcion || "Item",
    det.cantidad.toString(),
    formatCurrency(det.valorUnitario),
    det.impuestoCargoNombre ? `${det.impuestoCargoNombre} ${det.tarifaCargo ? `(${det.tarifaCargo}%)` : ''}` : '-',
    det.retencionNombre ? `${det.retencionNombre} ${det.tarifaRetencion ? `(${det.tarifaRetencion}%)` : ''}` : '-',
    formatCurrency(det.valorTotal)
  ]);
  
  const hasItems = tableBody.length > 0;

  autoTable(doc, {
    startY: 88,
    head: [['Ítem', 'Descripción', 'Cant.', 'V. Unitario', 'Cargo', 'Retención', 'V. Total']],
    body: hasItems ? tableBody : [['-', 'No hay detalles registrados', '-', '-', '-', '-', '-']],
    theme: 'plain',
    headStyles: {
      fillColor: [30, 58, 138],
      textColor: 255,
      fontStyle: 'bold',
      halign: 'center',
      fontSize: 7
    },
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: [71, 85, 105],
    },
    columnStyles: {
      0: { halign: 'left' },
      1: { fontStyle: 'bold', textColor: [30, 41, 59] },
      2: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'center', textColor: [37, 99, 235] },
      5: { halign: 'center', textColor: [5, 150, 105] },
      6: { halign: 'right', fontStyle: 'bold', textColor: [30, 58, 138] }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    }
  });
  
  const finalY = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY) + 15 || 100;
  
  // Footer Observaciones
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("OBSERVACIONES / NOTAS", 14, finalY);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, finalY + 2, 90, finalY + 2);
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8);
  doc.setFont("helvetica", "italic");
  doc.text("N/A", 14, finalY + 7);
  
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.text("RESOLUCIÓN DIAN", 14, finalY + 15);
  doc.line(14, finalY + 17, 90, finalY + 17);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Autorización de numeración de Facturación N/A de fecha N/A.", 14, finalY + 22);
  doc.text("Rango autorizado N/A.", 14, finalY + 26);
  
  // Footer Summary Totals
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(105, finalY - 5, 91, 50, 3, 3, 'FD');
  
  let currentY = finalY;
  doc.setFontSize(8);
  
  // Subtotal
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "bold");
  doc.text("SUBTOTAL", 110, currentY);
  doc.setTextColor(30, 41, 59);
  doc.text(formatCurrency(factura.subtotal), 190, currentY, { align: 'right' });
  doc.setDrawColor(226, 232, 240);
  doc.line(110, currentY + 2, 190, currentY + 2);
  currentY += 7;
  
  // Descuentos
  doc.setTextColor(100, 116, 139);
  doc.text("DESCUENTOS", 110, currentY);
  doc.setTextColor(239, 68, 68);
  doc.text(`- ${formatCurrency(factura.descuentoTotal)}`, 190, currentY, { align: 'right' });
  doc.setDrawColor(226, 232, 240);
  doc.line(110, currentY + 2, 190, currentY + 2);
  currentY += 7;
  
  // Impuestos
  const impuestosCargo = (factura.detalles || [])
    .filter(d => d.tarifaCargo && d.tarifaCargo > 0)
    .map(d => ({ nombre: d.impuestoCargoNombre, tarifa: d.tarifaCargo, valor: d.impuestoCargo }));

  const impuestosRetencion = (factura.detalles || [])
    .filter(d => d.tarifaRetencion && d.tarifaRetencion > 0)
    .map(d => ({ nombre: d.retencionNombre, tarifa: d.tarifaRetencion, valor: d.impuestoRetencion }));

  if (impuestosCargo.length > 0 || impuestosRetencion.length > 0) {
    impuestosCargo.forEach(imp => {
      doc.setTextColor(100, 116, 139);
      doc.text(`${(imp.nombre || 'CARGO').toUpperCase()} (${imp.tarifa}%)`, 110, currentY);
      doc.setTextColor(30, 41, 59);
      doc.text(formatCurrency(imp.valor), 190, currentY, { align: 'right' });
      doc.line(110, currentY + 2, 190, currentY + 2);
      currentY += 7;
    });
    impuestosRetencion.forEach(imp => {
      doc.setTextColor(100, 116, 139);
      doc.text(`${(imp.nombre || 'RETENCIÓN').toUpperCase()} (${imp.tarifa}%)`, 110, currentY);
      doc.setTextColor(239, 68, 68);
      doc.text(`- ${formatCurrency(imp.valor)}`, 190, currentY, { align: 'right' });
      doc.line(110, currentY + 2, 190, currentY + 2);
      currentY += 7;
    });
  } else {
    doc.setTextColor(100, 116, 139);
    doc.text("IMPUESTOS", 110, currentY);
    doc.setTextColor(30, 41, 59);
    doc.text(formatCurrency(factura.totalImpuestos), 190, currentY, { align: 'right' });
    doc.line(110, currentY + 2, 190, currentY + 2);
    currentY += 7;
  }
  
  // Total Pagar
  currentY += 2;
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(10);
  doc.text("TOTAL PAGAR", 110, currentY);
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(14);
  doc.text(formatCurrency(factura.totalNeto), 190, currentY + 1, { align: 'right' });
  
  doc.save(`Venta_${factura.numero || 'Documento'}.pdf`);
};
