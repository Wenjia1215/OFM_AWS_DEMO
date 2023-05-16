import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadFileCard from '../UploadFileCard/UploadFileCard.js';

async function sanitizeFile(file) {
  // Read file as buffer
  const fileBuffer = await file.arrayBuffer();

  if (file.type === 'application/pdf') {
    // Sanitize PDF
    const pdfDoc = await PDFDocument.load(fileBuffer);
    const sanitizedPdfBuffer = await PDFDocument.PDFDocumentWriter.saveToBytes(pdfDoc);
    return new File([sanitizedPdfBuffer], file.name, { type: 'application/pdf' });
  }

  // If file format is not supported, return original file
  console.log('File format is pdf, no need to sanitize');
  return file;
}

const TransparentShapingWrapper = (props) => {
  const [file, setFile] = useState(null);
  
  const enhancedOnChange = async (e) => {
    console.log('new release 1')
    // Pre-processing
    const originalFile = e.target.files[0];

    // Check file size (<= 2MB)
    if (originalFile.size > 2 * 1024 * 1024) {
      alert('File size should be less than or equal to 2MB');
      console.log('File size should be less than or equal to 2MB');
      return;
    }

    // Check file format (PDF, JPG, PNG)
    const acceptedFormats = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!acceptedFormats.includes(originalFile.type)) {      
      alert('File format should be PDF, JPG or PNG');
      console.log('File format should be PDF, JPG or PNG');
      return;
    }

    // Sanitize the file
    const sanitizedFile = await sanitizeFile(originalFile);
    
    // Set the sanitized file in state
    setFile(sanitizedFile);
  };

  // Use the sanitized file in your application
  // Here I'm just passing it to the original UploadFileCard component as a prop, but you could do anything you need with it
  return <UploadFileCard {...props} file={file} onChange={enhancedOnChange} />;
};

// Use the transparentShapingWrapper to enhance the UploadFileCard component

export default TransparentShapingWrapper;