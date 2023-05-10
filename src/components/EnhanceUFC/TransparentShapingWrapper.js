import React from 'react';
import UploadFileCard from '../UploadFileCard/UploadFileCard.js';

// Define a higher-order component that will act as an interceptor
function withTransparentShaping(WrappedComponent) {
  return class TransparentShapingWrapper extends React.Component {
    // Intercept the onChange event and apply additional behavior
    async onChangeInterceptor(e) {
      // Perform any pre-processing or security checks before calling the original onChange
      const file = e.target.files[0];
      const allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"]; // define allowed file types
      const maxFileSize = 1024 * 1024 * 2; // define max file size to 2MB

      if (!allowedFileTypes.includes(file.type)) {
        console.error("File type not allowed");
        return;
      }

      if (file.size > maxFileSize) {
        console.error("File size too large");
        return;
      }

      // Call the original onChange method
      await this.wrappedComponent.onChange(e);

      // Perform any post-processing or adaptations after the original onChange
      // Here we sanitize the filename (as an example)
      const filename = file.name;
      const sanitizedFilename = filename.replace(/[^\w.-]/g, '_'); // replace special characters with underscore
      console.log("Sanitized filename:", sanitizedFilename);
    }

    render() {
      const {props} = this;

      // Pass down the intercepted onChange event
      return (
        <WrappedComponent
          {...props}
          ref={(component) => (this.wrappedComponent = component)}
          onChange={this.onChangeInterceptor.bind(this)}
        />
      );
    }
  };
}

// Wrap the UploadFileCard component with the interceptor
const EnhancedUploadFileCard = withTransparentShaping(UploadFileCard);

export default EnhancedUploadFileCard;
