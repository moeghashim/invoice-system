// Database schema for Al Rayyan Furniture Invoice App

// Using MongoDB-like schema for flexibility with document-based structure

// Company Information (Static)
const companySchema = {
  name: "Al Rayyan Furniture",
  address: "Bayader Wadi Alser-Industrial Zone-Aldarbiat 12st",
  phone: "00962798557397",
  email: "samer@alrayyanfuriture.com",
  logo: "/assets/images/logo.png" // Path to the company logo
};

// Invoice Schema
const invoiceSchema = {
  invoice_number: String, // Unique identifier for the invoice (e.g., "651")
  quote_number: String,   // Quote number if applicable
  date: Date,             // Date of invoice creation
  validity_period: Number, // Number of days the quote/invoice is valid (default: 15)
  
  // Customer Information
  customer: {
    company_name: String,
    attention: String,    // Contact person
    phone: String
  },
  
  // Invoice Items
  items: [
    {
      item_number: String,
      description: String,
      quantity: Number,
      price: Number,
      extension: Number,  // Total for this item (quantity * price)
      image: String       // Optional path to item image
    }
  ],
  
  // Totals
  subtotal: Number,       // Sum of all item extensions
  tax: Number,            // Tax amount
  total: Number,          // Final total (subtotal + tax)
  
  // Additional Information
  terms: String,          // Payment terms or other conditions
  notes: String,          // Additional notes
  
  // Metadata
  created_at: Date,
  updated_at: Date,
  status: String          // "draft", "sent", "paid", etc.
};

// User Schema (for authentication)
const userSchema = {
  username: String,       // Default: "admin"
  password: String,       // Default: "admin" (will be hashed in implementation)
  last_login: Date
};

// Export schemas
module.exports = {
  companySchema,
  invoiceSchema,
  userSchema
};
