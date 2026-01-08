// frontend/src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const spinnerSize = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size] || '';

  return (
    <div className={`d-flex justify-content-center align-items-center ${className}`} style={{ minHeight: '200px' }}>
      <div 
        className={`spinner-border text-primary ${spinnerSize}`} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;