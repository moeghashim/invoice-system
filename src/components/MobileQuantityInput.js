import React from 'react';
import { InputGroup, Button, Form } from 'react-bootstrap';
import './MobileQuantityInput.css';

const MobileQuantityInput = ({ value, onChange, min = 1, max = 9999 }) => {
  // Handle increment button click
  const handleIncrement = () => {
    const newValue = parseInt(value) + 1;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  // Handle decrement button click
  const handleDecrement = () => {
    const newValue = parseInt(value) - 1;
    if (newValue >= min) {
      onChange(newValue);
    }
  };

  // Handle direct input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (newValue === '' || isNaN(newValue)) {
      onChange(min);
    } else {
      const numValue = parseInt(newValue);
      if (numValue >= min && (max === undefined || numValue <= max)) {
        onChange(numValue);
      }
    }
  };

  return (
    <InputGroup className="mobile-quantity-input">
      <Button 
        variant="outline-secondary"
        onClick={handleDecrement}
        disabled={value <= min}
        className="quantity-btn"
      >
        −
      </Button>
      <Form.Control
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        className="text-center quantity-input"
      />
      <Button 
        variant="outline-secondary"
        onClick={handleIncrement}
        disabled={max !== undefined && value >= max}
        className="quantity-btn"
      >
        +
      </Button>
    </InputGroup>
  );
};

export default MobileQuantityInput;
