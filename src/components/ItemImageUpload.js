import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

// Component for image upload modal
const ItemImageUpload = ({ show, handleClose, onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      // In a real app, this would upload to a server
      // For now, we'll just pass the file data URL to the parent component
      onImageUpload(previewUrl);
      handleClose();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Upload Item Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Select image file</Form.Label>
          <Form.Control 
            type="file" 
            accept="image/*"
            onChange={handleFileChange} 
          />
        </Form.Group>
        
        {previewUrl && (
          <div className="text-center mt-3">
            <p>Preview:</p>
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ maxWidth: '100%', maxHeight: '200px' }} 
            />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleUpload}
          disabled={!selectedFile}
          style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
        >
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemImageUpload;
