import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from 'react-bootstrap';

// PDF Export component that wraps around content to be printed
const PDFExport = ({ children, filename = 'document', triggerRef = null }) => {
  const contentRef = useRef();
  
  // Handle print/PDF generation
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: filename,
    // Optional callback after print
    onAfterPrint: () => console.log('PDF generated successfully'),
  });

  // If a trigger reference is provided, we'll use that instead of rendering our own button
  React.useEffect(() => {
    if (triggerRef && triggerRef.current) {
      // Use addEventListener instead of direct assignment for better compatibility
      const handleClick = (e) => {
        e.preventDefault();
        handlePrint();
      };
      
      triggerRef.current.addEventListener('click', handleClick);
      
      // Cleanup function to remove event listener
      return () => {
        if (triggerRef && triggerRef.current) {
          triggerRef.current.removeEventListener('click', handleClick);
        }
      };
    }
  }, [triggerRef, handlePrint]);

  return (
    <div>
      {/* The content to be printed */}
      <div ref={contentRef} className="print-content">
        {children}
      </div>
      
      {/* Only render button if no external trigger is provided */}
      {!triggerRef && (
        <div className="d-flex justify-content-end mt-3 no-print">
          <Button 
            variant="primary" 
            onClick={handlePrint}
            style={{ backgroundColor: '#8B4513', borderColor: '#8B4513' }}
          >
            Export PDF
          </Button>
        </div>
      )}
    </div>
  );
};

export default PDFExport;
