import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Card, Badge, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PDFExport from '../components/PDFExport';

// Import invoice service
import InvoiceService from '../services/InvoiceService';
import { formatDate, formatCurrency } from '../utils/format';
import { primaryColor } from '../constants/theme';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Fetch invoices from service
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        console.log('Fetching invoices...');
        const data = await InvoiceService.getInvoices();
        console.log('Fetched invoices:', data);
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setFetchError(error.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInvoices();
  }, []);

  // Function to determine badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'sent':
        return 'primary';
      case 'draft':
        return 'warning';
      default:
        return 'secondary';
    }
  };


  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Invoices</h2>
        <Link to="/invoices/new">
          <Button
            variant="primary"
            style={{ backgroundColor: primaryColor, borderColor: primaryColor }}
          >
            Create New Invoice
          </Button>
        </Link>
      </div>

      <Card>
        <Card.Body>
          {loading ? (
            <p className="text-center">Loading invoices...</p>
          ) : invoices.length === 0 ? (
            <p className="text-center">No invoices found. Create your first invoice!</p>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.id}</td>
                    <td>{formatDate(invoice.date)}</td>
                    <td>{invoice.customer?.company_name || invoice.company_name}</td>
                    <td>{formatCurrency(invoice.total)}</td>
                    <td>
                      <Badge bg={getStatusBadge(invoice.status)}>
                        {invoice.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link to={`/invoices/${invoice.id}`}>
                          <Button size="sm" variant="outline-primary">View</Button>
                        </Link>
                        <Link to={`/invoices/${invoice.id}`} target="_blank">
                          <Button size="sm" variant="outline-success">
                            Export PDF
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InvoiceList;
