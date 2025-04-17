import React from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
// Remove direct import of logo from public folder
// import logoUrl from '../../public/assets/images/logo.png';

class InvoicePDFGenerator {
  constructor(invoice) {
    this.invoice = invoice;
    this.doc = new jsPDF();
  }

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  }

  // Format date
  formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  // Add logo to PDF
  async addLogo() {
    return new Promise((resolve) => {
      // Use a base64 encoded logo or load from public URL
      const logoUrl = `${window.location.origin}/assets/images/logo.png`;
      
      const img = new Image();
      img.src = logoUrl;
      
      img.onload = () => {
        // Calculate aspect ratio to maintain proportions
        const imgWidth = 50;
        const imgHeight = (img.height * imgWidth) / img.width;
        
        // Add image to PDF
        this.doc.addImage(img, 'PNG', 15, 15, imgWidth, imgHeight);
        resolve();
      };
      
      // Fallback in case image fails to load
      img.onerror = () => {
        console.error('Error loading logo image');
        resolve();
      };
    });
  }

  // Add company information
  addCompanyInfo() {
    this.doc.setFontSize(10);
    this.doc.text('Bayader Wadi Alser-Industrial Zone-Aldarbiat 12st', 15, 45);
    this.doc.text('P: 0786050155', 15, 50);
    this.doc.text('E: Samerghachim101@gmail.com', 15, 55);
  }

  // Add invoice header
  addInvoiceHeader() {
    // Invoice title
    this.doc.setFontSize(20);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('INVOICE', 150, 25, { align: 'right' });
    
    // Invoice details
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Invoice #: ${this.invoice.id}`, 150, 35, { align: 'right' });
    this.doc.text(`Date: ${this.formatDate(this.invoice.date)}`, 150, 40, { align: 'right' });
  }

  // Add customer information
  addCustomerInfo() {
    this.doc.setFontSize(12);
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Bill To:', 15, 70);
    
    this.doc.setFontSize(10);
    this.doc.setFont(undefined, 'normal');
    this.doc.text(`Company: ${this.invoice.customer.company_name}`, 15, 77);
    
    if (this.invoice.customer.attention) {
      this.doc.text(`Attention: ${this.invoice.customer.attention}`, 15, 84);
    }
    
    if (this.invoice.customer.phone) {
      this.doc.text(`Phone: ${this.invoice.customer.phone}`, 15, 91);
    }
  }

  // Add invoice items table
  addItemsTable() {
    const tableColumn = ["#", "Description", "Qty", "Price", "Total"];
    const tableRows = [];
    
    // Add rows for each item
    this.invoice.items.forEach((item, index) => {
      const itemData = [
        (index + 1).toString(),
        item.description,
        item.quantity.toString(),
        this.formatCurrency(item.price),
        this.formatCurrency(item.extension)
      ];
      tableRows.push(itemData);
    });
    
    // Generate the table
    this.doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 100,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [139, 69, 19], textColor: [255, 255, 255] },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 20, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 30, halign: 'right' }
      }
    });
  }

  // Add totals section
  addTotals() {
    const finalY = this.doc.lastAutoTable.finalY + 10;
    
    this.doc.setFontSize(10);
    this.doc.text('Subtotal:', 130, finalY);
    this.doc.text(this.formatCurrency(this.invoice.subtotal), 180, finalY, { align: 'right' });
    
    this.doc.text('Tax:', 130, finalY + 7);
    this.doc.text(this.formatCurrency(this.invoice.tax), 180, finalY + 7, { align: 'right' });
    
    this.doc.setFont(undefined, 'bold');
    this.doc.text('Total:', 130, finalY + 14);
    this.doc.text(this.formatCurrency(this.invoice.total), 180, finalY + 14, { align: 'right' });
  }

  // Add terms section if available
  addTerms() {
    if (this.invoice.terms) {
      const finalY = this.doc.lastAutoTable.finalY + 30;
      
      this.doc.setFontSize(12);
      this.doc.setFont(undefined, 'bold');
      this.doc.text('Terms:', 15, finalY);
      
      this.doc.setFontSize(10);
      this.doc.setFont(undefined, 'normal');
      this.doc.text(this.invoice.terms, 15, finalY + 7);
    }
  }

  // Add footer
  addFooter() {
    const pageCount = this.doc.internal.getNumberOfPages();
    this.doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text(
        `Page ${i} of ${pageCount}`,
        this.doc.internal.pageSize.width / 2,
        this.doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
    }
  }

  // Generate the complete PDF
  async generatePDF() {
    try {
      // Add logo (wait for it to load)
      await this.addLogo();
      
      // Add company and invoice information
      this.addCompanyInfo();
      this.addInvoiceHeader();
      this.addCustomerInfo();
      
      // Add items table
      this.addItemsTable();
      
      // Add totals and terms
      this.addTotals();
      this.addTerms();
      
      // Add footer
      this.addFooter();
      
      // Save the PDF with a meaningful filename
      this.doc.save(`Invoice-${this.invoice.id}.pdf`);
      
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
  }
}

export default InvoicePDFGenerator;
