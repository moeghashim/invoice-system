// Found the bug in the updateTotals function!
// The issue is that it's adding each extension to the subtotal for BOTH quantity and price inputs,
// effectively doubling the value.

// Here's the fixed version of the updateTotals function:
function updateTotals() {
  let subtotal = 0;
  
  // Calculate subtotal by summing the extensions of each item
  // We need to make sure we only add each item's extension ONCE to the subtotal
  const rows = document.querySelectorAll('#items-table-body tr');
  
  rows.forEach(row => {
    const quantity = parseFloat(row.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const extension = quantity * price;
    
    // Update the extension display in the row
    row.querySelector('.item-extension').textContent = formatCurrency(extension);
    
    // Add to subtotal (only once per row)
    subtotal += extension;
  });
  
  // Get tax rate
  const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
  
  // Calculate tax and total
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;
  
  // Update display
  document.getElementById('subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('tax').textContent = formatCurrency(tax);
  document.getElementById('total').textContent = formatCurrency(total);
}
