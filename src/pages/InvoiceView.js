import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import InvoicePDFExport from '../components/InvoicePDFExport';
import InvoicePDFCustom from '../components/InvoicePDFCustom';

// Import invoice service
import InvoiceService from '../services/InvoiceService';
import { formatDate, formatCurrency } from '../utils/format';
import { primaryColor } from '../constants/theme';

const InvoiceView = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await InvoiceService.getInvoiceById(id);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return (
      <Container className="mt-4">
        <Card>
          <Card.Body className="text-center">
            <h3>Invoice not found</h3>
            <p>The invoice you're looking for doesn't exist or has been deleted.</p>
            <Link to="/invoices">
              <Button variant="primary">Back to Invoices</Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }


  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Invoice #{invoice.id}</h2>
        <div className="d-flex gap-2">
          <InvoicePDFExport invoice={invoice}>
            <Button
              variant="primary"
              style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
            >
              Export PDF
            </Button>
          </InvoicePDFExport>
          <InvoicePDFCustom invoice={invoice}>
            <Button 
              variant="primary" 
              style={{ backgroundColor: '#0074d9', borderColor: '#0074d9' }}
            >
              Export Custom PDF
            </Button>
          </InvoicePDFCustom>
          <Link to="/invoices">
            <Button variant="outline-secondary">Back to List</Button>
          </Link>
        </div>
      </div>

      {/* Invoice Content */}
      <Card>
        <Card.Body>
          <div className="invoice-header">
            <Row>
              <Col md={6}>
                <img 
                  src={process.env.PUBLIC_URL + "/assets/images/logo.png"} 
                  alt="Al Rayyan Furniture Logo" 
                  className="invoice-company-logo mb-3"
                />
                <div className="invoice-company-info">
                  <p className="mb-1">Bayader Wadi Alser-Industrial Zone-Aldarbiat 12st</p>
                  <p className="mb-1">P: 0786050155</p>
                  <p>E: Samerghachim101@gmail.com</p>
                </div>
              </Col>
              <Col md={6} className="text-md-end">
                <h3 className="mb-3">INVOICE</h3>
                <p className="mb-1"><strong>Invoice #:</strong> {invoice.id}</p>
                <p className="mb-1"><strong>Date:</strong> {formatDate(invoice.date)}</p>
              </Col>
            </Row>
          </div>

          <div className="invoice-customer-info">
            <Row>
              <Col md={6}>
                <h5>Bill To:</h5>
                <p className="mb-1"><strong>Company:</strong> {invoice.customer?.company_name || invoice.company_name}</p>
                {(invoice.customer?.attention || invoice.attention) && (
                  <p className="mb-1"><strong>Attention:</strong> {invoice.customer?.attention || invoice.attention}</p>
                )}
                {(invoice.customer?.phone || invoice.phone) && (
                  <p><strong>Phone:</strong> {invoice.customer?.phone || invoice.phone}</p>
                )}
              </Col>
            </Row>
          </div>

          <Table responsive className="invoice-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Number</th>
                <th>Description</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Price</th>
                <th className="text-end">Extension</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.item_number}</td>
                  <td>{item.description}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">{formatCurrency(item.price)}</td>
                  <td className="text-end">{formatCurrency(item.extension)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="invoice-totals">
            <Row>
              <Col md={6} lg={8}></Col>
              <Col md={6} lg={4}>
                <Table>
                  <tbody>
                    <tr>
                      <td><strong>Subtotal:</strong></td>
                      <td className="text-end">{formatCurrency(invoice.subtotal)}</td>
                    </tr>
                    <tr>
                      <td><strong>Tax:</strong></td>
                      <td className="text-end">{formatCurrency(invoice.tax)}</td>
                    </tr>
                    <tr>
                      <td><strong>Total:</strong></td>
                      <td className="text-end"><strong>{formatCurrency(invoice.total)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </div>

          {invoice.terms && (
            <div className="mt-4">
              <h5>Terms:</h5>
              <p>{invoice.terms}</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InvoiceView;
