import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportConfig<T> {
  filename: string;
  data: T[];
  columns: { 
    header: string; 
    dataKey: keyof T | ((item: T) => string); 
  }[];
}

export const exportToExcel = <T,>({ filename, columns, data }: ExportConfig<T>) => {
  const worksheetData = data.map(item => {
    const row: any = {};
    columns.forEach(col => {
      row[col.header] = typeof col.dataKey === 'function' 
        ? col.dataKey(item) 
        : item[col.dataKey];
    });
    return row;
  });

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
  XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = <T,>({ filename, columns, data }: ExportConfig<T>) => {
  const doc = new jsPDF();
  const tableHeaders = columns.map(col => col.header);
  const tableRows = data.map(item => 
    columns.map(col => {
      const val = typeof col.dataKey === 'function' 
        ? col.dataKey(item) 
        : item[col.dataKey];
      return String(val ?? '');
    })
  );

  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [37, 99, 235], fontSize: 8 },
    styles: { fontSize: 7 },
  });

  doc.save(`${filename}.pdf`);
};