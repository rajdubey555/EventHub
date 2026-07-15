import React from 'react';

// Centered spinning indicator for async loading states
const Spinner = () => {
  return (
    <div className="flex items-center justify-center py-12" id="loading-spinner">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary-600"></div>
    </div>
  );
};

export default Spinner;
