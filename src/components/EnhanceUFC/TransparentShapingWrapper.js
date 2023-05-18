import React, { useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import UploadFileCard from '../UploadFileCard/UploadFileCard.js';

async function sanitizeFile(file) {
  // console.log('sanitizeFile')
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
  const inputRef = useRef(null);

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
    
    // Create a new Event to emulate a file selection and set the sanitized file
    const newEvent = new Event('change', { bubbles: true });
    newEvent.target = { files: [sanitizedFile], value: sanitizedFile.name };
    
    // Pass the new event to the original onChange handler
    if (props.onChange) {
      await props.onChange(newEvent);
    }
  };

  // Pass the enhanced onChange handler to the original component
  return <UploadFileCard {...props} onChange={enhancedOnChange} inputRef={inputRef}/>;
};

export default TransparentShapingWrapper;
