import React from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

autoTable(jsPDF); // Explicitly register the plugin

// Color definitions
const BLACK = '#000000';
const BLUE = '#0074d9';
const RED = '#d90429';

const InvoicePDFCustom = ({ invoice, children }) => {
  const generatePDF = () => {
    console.log('[InvoicePDFCustom] Export button clicked. Invoice:', invoice);
    try {
      const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 15;

    // --- Header ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(BLACK);
    doc.text('شركة الريان لصناعة المفروشات ذ.م.م', 200, y, { align: 'right' });
    y += 7;
    doc.setFont('helvetica', 'normal');
    doc.text('AL RAYYAN', pageWidth / 2, y, { align: 'center' });
    doc.setFontSize(11);
    doc.text('FURNITURE MANUFACTURING CO.L.L.T', 10, y, { align: 'left' });
    y += 6;
    doc.text('عمان – البيادر – المنطقة الصناعية', 200, y, { align: 'right' });
    doc.text('AMMAN – AL BAYADER', 10, y, { align: 'left' });
    y += 6;
    doc.text('تلفون: 0788497561 - 0798557397', 200, y, { align: 'right' });
    y += 8;

    // --- Invoice Number Row ---
    doc.setFontSize(12);
    doc.setTextColor(BLACK);
    doc.text('الرقم الضريبي', 55, y);
    doc.setDrawColor(BLACK);
    doc.rect(15, y - 5, 40, 10);
    // Draw 8 boxes for tax number
    for (let i = 0; i < 8; i++) {
      doc.rect(15 + i * 5, y + 5, 5, 5);
      doc.text(String(8 - i), 17 + i * 5, y + 9, { fontSize: 8 });
    }
    doc.setFontSize(16);
    doc.setTextColor(BLACK);
    doc.text('فاتورة', pageWidth / 2, y + 7, { align: 'center' });
    doc.setFontSize(12);
    doc.setTextColor(BLUE);
    doc.text('المطلوب من السادة:', 200, y + 18, { align: 'right' });
    doc.text(invoice.customer.company_name || '', 170, y + 18, { align: 'right' });
    doc.setTextColor(BLACK);
    doc.text('التاريخ:', 200, y + 7, { align: 'right' });
    doc.setTextColor(BLUE);
    doc.text(new Date(invoice.date).toLocaleDateString('en-GB'), 185, y + 7, { align: 'right' });
    doc.setTextColor(RED);
    doc.text(String(660 + (invoice.id ? invoice.id - 1 : 0)), 120, y + 13, { align: 'center' });
    doc.setTextColor(BLACK);
    y += 22;

    // --- Table ---
    const tableColumn = [
      { header: 'السعر الإجمالي', dataKey: 'total' },
      { header: 'الوصف', dataKey: 'description' },
      { header: 'عدد', dataKey: 'quantity' },
      { header: 'سعر الوحدة', dataKey: 'unit' },
    ];
    const tableRows = invoice.items.map(item => ({
      total: `${item.extension.toLocaleString('en-US', { minimumFractionDigits: 3 })}`,
      description: item.description,
      quantity: item.quantity,
      unit: `${item.price.toLocaleString('en-US', { minimumFractionDigits: 3 })}`,
    }));
    doc.autoTable({
      head: [tableColumn.map(col => col.header)],
      body: tableRows.map(row => tableColumn.map(col => row[col.dataKey])),
      startY: y,
      styles: { font: 'helvetica', fontSize: 11, textColor: BLUE, halign: 'center', valign: 'middle' },
      headStyles: { fillColor: [255,255,255], textColor: BLACK, fontStyle: 'bold', halign: 'center', lineWidth: 0.5, lineColor: BLACK },
      bodyStyles: { lineWidth: 0.5, lineColor: BLACK },
      tableLineColor: BLACK,
      tableLineWidth: 0.5,
      theme: 'grid',
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: 40 }, // total
        1: { cellWidth: 60 }, // description
        2: { cellWidth: 20 }, // quantity
        3: { cellWidth: 40 }, // unit
      },
    });
    y = doc.lastAutoTable.finalY + 5;

    // --- Totals ---
    doc.setFontSize(12);
    doc.setTextColor(BLACK);
    doc.text('المجموع:', 200, y, { align: 'right' });
    doc.setTextColor(BLUE);
    doc.text(`${invoice.subtotal.toLocaleString('en-US', { minimumFractionDigits: 3 })}`, 170, y, { align: 'right' });
    y += 7;
    doc.setTextColor(BLACK);
    doc.text('%ضريبة المبيعات 16:', 200, y, { align: 'right' });
    doc.setTextColor(BLUE);
    doc.text(`${invoice.tax.toLocaleString('en-US', { minimumFractionDigits: 3 })}`, 170, y, { align: 'right' });
    y += 7;
    doc.setTextColor(BLACK);
    doc.text('المجموع الكلي:', 200, y, { align: 'right' });
    doc.setTextColor(BLUE);
    doc.text(`${invoice.total.toLocaleString('en-US', { minimumFractionDigits: 3 })}`, 170, y, { align: 'right' });
    y += 14;

    // --- Signature ---
    doc.setFontSize(12);
    doc.setTextColor(BLUE);
    doc.text('توقيع المستلم...............................', 200, y, { align: 'right' });

    // Save PDF
    doc.save(`Invoice-${invoice.id}.pdf`);
    } catch (err) {
      console.error('[InvoicePDFCustom] PDF generation error:', err);
      alert('Custom PDF export failed: ' + err.message);
    }
  };

  return (
    <div>
      {React.cloneElement(children, { onClick: generatePDF })}
    </div>
  );
};

export default InvoicePDFCustom;
