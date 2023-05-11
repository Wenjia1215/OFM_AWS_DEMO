import { PDFDocument } from 'pdf-lib';
// import sharp from 'sharp-browser';
import React from 'react';
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

  // if (['image/jpeg', 'image/png'].includes(file.type)) {
  //   // Sanitize JPG or PNG
  //   const sanitizedImageBuffer = await sharp(fileBuffer).toBuffer();
  //   return new File([sanitizedImageBuffer], file.name, { type: file.type });
  // }

  // If file format is not supported, return original file
  return file;
}


const transparentShapingWrapper = (WrappedComponent) => {
  return (props) => {
    const enhancedOnChange = async (e) => {
      // Pre-processing
      const file = e.target.files[0];

      // Check file size (<= 2MB)
      if (file.size > 2 * 1024 * 1024) {
        console.log('File size should be less than or equal to 2MB');
        return;
      }

      // Check file format (PDF, JPG, PNG)
      const acceptedFormats = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!acceptedFormats.includes(file.type)) {
        console.log('File format should be PDF, JPG or PNG');
        return;
      }

      // Call original onChange with the file
      await props.onChange(e);

      // Post-processing
      const sanitizedFile = sanitizeFile(file);

      // Update the file in the event
      e.target.files[0] = sanitizedFile;
    };

    return <WrappedComponent {...props} onChange={enhancedOnChange} />;
  };
};

// Use the transparentShapingWrapper to enhance the UploadFileCard component
const EnhancedUploadFileCard = transparentShapingWrapper(UploadFileCard);

export default EnhancedUploadFileCard;
