// Netlify Function: getInvoices.js
// This function fetches invoices from your Supabase database

const { createClient } = require('@supabase/supabase-js');

// Environment variables (set these in Netlify dashboard)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

exports.handler = async function(event, context) {
  // Example: Fetch all invoices from the 'invoices' table
  const { data, error } = await supabase
    .from('invoices')
    .select('*');

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(data)
  };
};
