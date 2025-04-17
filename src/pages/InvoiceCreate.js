import React, { useState } from 'react';
import { Container, Form, Button, Card, Row, Col, Table, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import ItemImageUpload from '../components/ItemImageUpload';
import MobileQuantityInput from '../components/MobileQuantityInput';
import InvoiceService from '../services/InvoiceService';

const InvoiceCreate = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    company_name: '',
    attention: '',
    phone: ''
  });
  
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [items, setItems] = useState([
    { description: '', quantity: 1, price: 0, extension: 0, image: null }
  ]);
  const [terms, setTerms] = useState('');
  const [taxRate, setTaxRate] = useState(16); // Default tax rate 16%
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  
  // Calculate subtotal, tax, and total - ensuring each item is only counted once
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };
  
  const subtotal = calculateSubtotal();
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  
  // Handle item changes
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    
    // Convert string values to numbers for numeric fields
    if (field === 'quantity' || field === 'price') {
      // Allow empty string for price field to remove the 0
      if (field === 'price' && value === '') {
        value = '';
      } else {
        value = parseFloat(value) || 0;
      }
    }
    
    newItems[index][field] = value;
    
    // Recalculate extension
    if (field === 'quantity' || field === 'price') {
      // Handle empty price field for extension calculation
      const price = newItems[index].price === '' ? 0 : newItems[index].price;
      newItems[index].extension = newItems[index].quantity * price;
    }
    
    setItems(newItems);
  };
  
  // Add new item row
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, price: 0, extension: 0, image: null }]);
  };
  
  // Handle image upload for an item
  const handleImageUpload = (index) => {
    setCurrentItemIndex(index);
    setShowImageUpload(true);
  };
  
  // Handle image upload completion
  const handleImageUploaded = (imageUrl) => {
    const newItems = [...items];
    newItems[currentItemIndex].image = imageUrl;
    setItems(newItems);
  };
  
  // Remove item row
  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'JOD'
    }).format(amount);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create invoice data object
      const invoiceData = {
        customer,
        items,
        date: invoiceDate,
        terms,
        subtotal,
        tax,
        total,
        status: 'draft'
      };
      
      // Save invoice using service
      const result = await InvoiceService.createInvoice(invoiceData);
      
      alert(`Invoice #${result.id} created successfully!`);
      navigate('/invoices');
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    }
  };
  
  return (
    <Container className="mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create New Invoice</h2>
        <Link to="/invoices">
          <Button variant="outline-secondary">Cancel</Button>
        </Link>
      </div>
      
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Invoice Information</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="invoiceDate">
                  <Form.Label>Invoice Date*</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Body>
            <h5 className="mb-3">Customer Information</h5>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="customerCompany">
                  <Form.Label>Company Name*</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={customer.company_name}
                    onChange={(e) => setCustomer({...customer, company_name: e.target.value})}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Group controlId="customerAttention">
                  <Form.Label>Attention</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={customer.attention}
                    onChange={(e) => setCustomer({...customer, attention: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group controlId="customerPhone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={customer.phone}
                    onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Invoice Items</h5>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={addItem}
              >
                Add Item
              </Button>
            </div>
            
            <Table responsive>
              <thead>
                <tr>
                  <th style={{width: '45%'}}>Description</th>
                  <th style={{width: '15%'}}>Qty</th>
                  <th style={{width: '15%'}}>Price</th>
                  <th style={{width: '15%'}}>Total</th>
                  <th style={{width: '10%'}}></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <Form.Control 
                        type="text" 
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        required
                      />
                    </td>
                    <td>
                      <MobileQuantityInput 
                        value={item.quantity}
                        onChange={(value) => handleItemChange(index, 'quantity', value)}
                        min={1}
                      />
                    </td>
                    <td>
                      <InputGroup>
                        <InputGroup.Text>JOD</InputGroup.Text>
                        <Form.Control 
                          type="number" 
                          step="0.01"
                          value={item.price}
                          onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                          min="0"
                          required
                        />
                      </InputGroup>
                    </td>
                    <td className="text-end align-middle">
                      {formatCurrency(item.extension)}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          onClick={() => handleImageUpload(index)}
                          title="Upload Image"
                        >
                          {item.image ? 'Change Image' : 'Add Image'}
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            
            {/* Image Upload Modal */}
            <ItemImageUpload 
              show={showImageUpload}
              handleClose={() => setShowImageUpload(false)}
              onImageUpload={handleImageUploaded}
            />
            
            <Row className="mt-3">
              <Col md={6}></Col>
              <Col md={6}>
                <Table>
                  <tbody>
                    <tr>
                      <td>Subtotal:</td>
                      <td className="text-end">{formatCurrency(subtotal)}</td>
                    </tr>
                    <tr>
                      <td>
                        <InputGroup size="sm">
                          <Form.Control 
                            type="number" 
                            value={taxRate}
                            onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                            min="0"
                            max="100"
                            style={{maxWidth: '70px'}}
                          />
                          <InputGroup.Text>% Tax:</InputGroup.Text>
                        </InputGroup>
                      </td>
                      <td className="text-end">{formatCurrency(tax)}</td>
                    </tr>
                    <tr>
                      <td><strong>Total:</strong></td>
                      <td className="text-end"><strong>{formatCurrency(total)}</strong></td>
                    </tr>
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <Card className="mb-4">
          <Card.Body>
            <Form.Group controlId="terms">
              <Form.Label>Terms & Conditions</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
              />
            </Form.Group>
          </Card.Body>
        </Card>
        
        <div className="d-flex justify-content-end gap-2">
          <Link to="/invoices">
            <Button variant="outline-secondary">Cancel</Button>
          </Link>
          <Button 
            type="submit" 
            variant="primary"
            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
          >
            Create Invoice
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default InvoiceCreate;
