import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  showItemsInfo = false,
  className = ""
}) => {
  return (
    <div className={`pagination flex flex-wrap gap-2 mt-4 ${className}`}>
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        {'<'}
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-2 py-1 border rounded ${currentPage === i + 1 ? 'bg-purple-200 font-bold' : ''}`}
        >
          {i + 1}
        </button>
      ))}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        {'>'}
      </button>
    </div>
  );
};

export default Pagination; 