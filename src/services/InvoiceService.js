// InvoiceService using Supabase for all operations
import { supabase } from '../supabaseClient';

class InvoiceService {
  // Get all invoices from Supabase
  async getInvoices() {
    const { data, error } = await supabase.from('invoices').select('*').order('id', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  // Get invoice by ID from Supabase
  async getInvoiceById(id) {
    const { data, error } = await supabase.from('invoices').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  // Create new invoice in Supabase, auto-incrementing from 1001 if table is empty
  async createInvoice(invoiceData) {
    // Find current max id
    const { data: maxIdRow, error: maxIdError } = await supabase
      .from('invoices')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);
    if (maxIdError) throw maxIdError;
    let newId = 1001;
    if (maxIdRow && maxIdRow.length > 0 && maxIdRow[0].id) {
      newId = parseInt(maxIdRow[0].id, 10) + 1;
    }
    const newInvoice = {
      ...invoiceData,
      id: newId,
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
    };
    const { data, error } = await supabase.from('invoices').insert([newInvoice]).select().single();
    if (error) throw error;
    return data;
  }

  // Update existing invoice in Supabase
  async updateInvoice(id, invoiceData) {
    const { data, error } = await supabase
      .from('invoices')
      .update(invoiceData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Delete invoice in Supabase
  async deleteInvoice(id) {
    const { error } = await supabase.from('invoices').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  }
}

export default new InvoiceService();

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
