// Mock API service for invoice data
// In a real application, this would connect to a backend server

class InvoiceService {
  constructor() {
    // Initialize with mock data from localStorage or default data
    this.initializeData();
  }

  // Initialize data from localStorage or use defaults
  initializeData() {
    const storedInvoices = localStorage.getItem('invoices');
    if (storedInvoices) {
      this.invoices = JSON.parse(storedInvoices);
    } else {
      // Default mock data
      this.invoices = [
        {
          id: '651',
          date: '2025-02-27',
          customer: {
            company_name: 'شركة لام فاء للديكور',
            attention: '',
            phone: ''
          },
          items: [
            { item_number: 'Wood chair', description: 'Wood chair', quantity: 16, price: 56, extension: 896, image: null },
            { item_number: 'Table base', description: 'Table base', quantity: 2, price: 172.5, extension: 345, image: null },
            { item_number: 'Metal console', description: 'Metal console', quantity: 1, price: 86.5, extension: 86.5, image: null }
          ],
          subtotal: 1327.5,
          tax: 213,
          total: 1540.5,
          terms: '',
          status: 'sent',
          validity_period: 15
        },
        {
          id: '650',
          date: '2025-02-15',
          customer: {
            company_name: 'Al Manar Furniture',
            attention: 'Mohammed',
            phone: '00962777123456'
          },
          items: [
            { item_number: 'Sofa set', description: 'Luxury sofa set', quantity: 1, price: 2350.75, extension: 2350.75, image: null }
          ],
          subtotal: 2350.75,
          tax: 376.12,
          total: 2726.87,
          terms: 'Payment due within 30 days',
          status: 'paid',
          validity_period: 15
        },
        {
          id: '649',
          date: '2025-02-10',
          customer: {
            company_name: 'Home Center',
            attention: 'Sarah',
            phone: '00962799887766'
          },
          items: [
            { item_number: 'Dining table', description: 'Wooden dining table', quantity: 3, price: 625.08, extension: 1875.24, image: null }
          ],
          subtotal: 1875.24,
          tax: 300.04,
          total: 2175.28,
          terms: '',
          status: 'draft',
          validity_period: 15
        }
      ];
      this.saveToLocalStorage();
    }
  }

  // Save current data to localStorage
  saveToLocalStorage() {
    localStorage.setItem('invoices', JSON.stringify(this.invoices));
  }

  // Get all invoices
  getInvoices() {
    return Promise.resolve([...this.invoices]);
  }

  // Get invoice by ID
  getInvoiceById(id) {
    const invoice = this.invoices.find(inv => inv.id === id);
    return Promise.resolve(invoice ? {...invoice} : null);
  }

  // Create new invoice
  createInvoice(invoiceData) {
    // Generate a new ID (in a real app, this would come from the server)
    const newId = (Math.max(...this.invoices.map(inv => parseInt(inv.id)), 0) + 1).toString();
    
    const newInvoice = {
      ...invoiceData,
      id: newId,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      status: 'draft'
    };
    
    this.invoices.unshift(newInvoice); // Add to beginning of array
    this.saveToLocalStorage();
    
    return Promise.resolve({...newInvoice});
  }

  // Update existing invoice
  updateInvoice(id, invoiceData) {
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Invoice not found'));
    }
    
    const updatedInvoice = {
      ...this.invoices[index],
      ...invoiceData,
      id // Ensure ID doesn't change
    };
    
    this.invoices[index] = updatedInvoice;
    this.saveToLocalStorage();
    
    return Promise.resolve({...updatedInvoice});
  }

  // Delete invoice
  deleteInvoice(id) {
    const index = this.invoices.findIndex(inv => inv.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Invoice not found'));
    }
    
    this.invoices.splice(index, 1);
    this.saveToLocalStorage();
    
    return Promise.resolve({ success: true });
  }
}

export default new InvoiceService();
