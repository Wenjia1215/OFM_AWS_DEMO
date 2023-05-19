import React, { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadFileCard from '../UploadFileCard/UploadFileCard.js';

async function sanitizeFile(file) {
  // Read file into memory as an ArrayBuffer.
  const fileBuffer = await file.arrayBuffer();

  if (file.type === 'application/pdf') {
    // Load the PDF into a PDFDocument object
    const originalPdfDoc = await PDFDocument.load(fileBuffer);

    // Create a new PDFDocument
    const newPdfDoc = await PDFDocument.create();

    // Get the page indices of the original document
    const pageIndices = Array.from({ length: originalPdfDoc.getPageCount() }, (_, i) => i);

    // Copy the pages to the new document
    const copiedPages = await newPdfDoc.copyPages(originalPdfDoc, pageIndices);
    copiedPages.forEach(page => newPdfDoc.addPage(page));

    // Save the new PDF as a byte array
    const sanitizedPdfBuffer = await newPdfDoc.save();

    // Create a new File object with the sanitized PDF
    const sanitizedFile = new File([sanitizedPdfBuffer], file.name, { type: 'application/pdf' });

    return sanitizedFile;
  }
}

const TransparentShapingWrapper = (props) => {
  const inputRef = useRef(null);
  const [filename, setFilename] = useState(null);
  
  const enhancedOnChange = async (e) => {
    console.log('TransparentShapingWrapper log')
    // Pre-processing
    const originalFile = e.target.files[0];

    // Check file size (<= 2MB)
    if (originalFile.size > 2 * 1024 * 1024) {
      alert('File size should be less than or equal to 2MB');
      console.log('File size should be less than or equal to 2MB');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    // Check file format (PDF, JPG, PNG)
    const acceptedFormats = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!acceptedFormats.includes(originalFile.type)) {      
      alert('File format should be PDF, JPG or PNG');
      console.log('File format should be PDF, JPG or PNG');
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      return;
    }

    // Sanitize the file
    const sanitizedFile = await sanitizeFile(originalFile);
    
    if (sanitizedFile) {
      // Set file name here (assuming you have a function to do so)
      setFilename(sanitizedFile.name);
      // Create a new pseudo-event object with the sanitized file
      const newEvent = {
        ...e, 
        target: { 
          ...e.target, 
          files: [sanitizedFile], 
          value: sanitizedFile.name 
        },
      };

      // Pass the new event to the original onChange handle
      if (props.onChange) {
        await props.onChange(newEvent);
      }
    }
    
  };

  // Pass the enhanced onChange handler to the original component
  return <UploadFileCard {...props} onChange={enhancedOnChange} inputRef={inputRef}/>;
};

export default TransparentShapingWrapper;
