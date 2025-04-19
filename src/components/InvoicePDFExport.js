import React from 'react';
import html2pdf from 'html2pdf.js';

const InvoicePDFExport = ({ invoice, children }) => {
  const generatePDF = () => {
    try {
      // Get the invoice element
      const element = document.getElementById('invoice-to-print');
      
      if (!element) {
        console.error('Invoice element not found');
        alert('Error: Could not find invoice content to export');
        return;
      }
      
      // Configure html2pdf options for single A4 page
      const opt = {
        margin: [5, 5, 5, 5], // smaller margins
        filename: `Invoice-${invoice.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 1, // avoid oversize
          useCORS: true,
          logging: true,
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Add style to prevent page breaks inside invoice
      const style = document.createElement('style');
      style.innerHTML = `
        #invoice-to-print {
          max-width: 190mm;
          margin: 0 auto;
          page-break-inside: avoid !important;
        }
        #invoice-to-print table, #invoice-to-print tr, #invoice-to-print td, #invoice-to-print th, #invoice-to-print div {
          page-break-inside: avoid !important;
        }
      `;
      document.head.appendChild(style);
      
      // Display loading message to user
      const loadingMessage = document.createElement('div');
      loadingMessage.style.position = 'fixed';
      loadingMessage.style.top = '50%';
      loadingMessage.style.left = '50%';
      loadingMessage.style.transform = 'translate(-50%, -50%)';
      loadingMessage.style.padding = '20px';
      loadingMessage.style.background = 'rgba(0,0,0,0.7)';
      loadingMessage.style.color = 'white';
      loadingMessage.style.borderRadius = '5px';
      loadingMessage.style.zIndex = '9999';
      loadingMessage.textContent = 'Generating PDF, please wait...';
      document.body.appendChild(loadingMessage);
      
      // Show the element before exporting
      const previousDisplay = element.style.display;
      element.style.display = 'block';

      // Generate PDF with progress tracking
      html2pdf().from(element).set(opt).save().then(() => {
        // Hide the element again after export
        element.style.display = previousDisplay;
        document.body.removeChild(loadingMessage);
        // Remove the added style
        document.head.removeChild(style);
        console.log('PDF generated successfully');
      }).catch(error => {
        element.style.display = previousDisplay;
        document.body.removeChild(loadingMessage);
        document.head.removeChild(style);
        console.error('Error generating PDF:', error);
        alert('There was an error generating the PDF. Please try again or contact support.');
      });
    } catch (error) {
      console.error('Error in PDF generation process:', error);
      alert('There was an error generating the PDF. Please try again or contact support.');
    }
  };

  return (
    <div>
      <div id="invoice-to-print" style={{ display: 'none' }}>
        {/* Logo and header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img 
            src={`${window.location.origin}/assets/images/logo.png`} 
            alt="Al Rayyan Furniture Logo" 
            style={{ maxWidth: '200px', marginBottom: '10px' }}
          />
          <h2 style={{ margin: '5px 0' }}>Al Rayyan Furniture</h2>
          <p style={{ margin: '2px 0' }}>Bayader Wadi Alser-Industrial Zone-Aldarbiat 12st</p>
          <p style={{ margin: '2px 0' }}>P: 0786050155</p>
          <p style={{ margin: '2px 0' }}>E: Samerghachim101@gmail.com</p>
        </div>
        
        {/* Invoice details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: '5px 0' }}>Bill To:</h3>
            <p style={{ margin: '2px 0' }}><strong>Company:</strong> {invoice.customer.company_name}</p>
            {invoice.customer.attention && (
              <p style={{ margin: '2px 0' }}><strong>Attention:</strong> {invoice.customer.attention}</p>
            )}
            {invoice.customer.phone && (
              <p style={{ margin: '2px 0' }}><strong>Phone:</strong> {invoice.customer.phone}</p>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1 style={{ margin: '5px 0', color: '#8B4513' }}>INVOICE</h1>
            <p style={{ margin: '2px 0' }}><strong>Invoice #:</strong> {invoice.id}</p>
            <p style={{ margin: '2px 0' }}><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString('en-GB')}</p>
          </div>
        </div>
        
        {/* Items table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#8B4513', color: 'white' }}>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>#</th>
              <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Qty</th>
              <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Price</th>
              <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{index + 1}</td>
                <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{item.description}</td>
                <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{item.quantity}</td>
                <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'JOD' }).format(item.price)}
                </td>
                <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'JOD' }).format(item.extension)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <table style={{ width: '300px', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}><strong>Subtotal:</strong></td>
                <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'JOD' }).format(invoice.subtotal)}
                </td>
              </tr>
              <tr>
                <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}><strong>Tax:</strong></td>
                <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'JOD' }).format(invoice.tax)}
                </td>
              </tr>
              <tr style={{ backgroundColor: '#f9f9f9' }}>
                <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}><strong>Total:</strong></td>
                <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'JOD' }).format(invoice.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Terms if available */}
        {invoice.terms && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '5px 0' }}>Terms:</h3>
            <p style={{ margin: '2px 0' }}>{invoice.terms}</p>
          </div>
        )}
        
        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
          <p style={{ margin: '2px 0', fontSize: '12px' }}>Thank you for your business!</p>
        </div>
      </div>
      
      {/* Render children with onClick handler for PDF generation */}
      {React.cloneElement(children, { onClick: generatePDF })}
    </div>
  );
};

export default InvoicePDFExport;
