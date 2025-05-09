// src/components/Common/Pagination.js
import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) {
    return null; // Don't render pagination if not needed
  }

  // Logic for displaying page numbers (e.g., show a limited range with ellipses)
  let startPage, endPage;
  if (totalPages <= 5) {
    // Less than 5 total pages so show all
    startPage = 1;
    endPage = totalPages;
  } else {
    // More than 5 total pages so calculate start and end pages
    if (currentPage <= 3) {
      startPage = 1;
      endPage = 5;
    } else if (currentPage + 2 >= totalPages) {
      startPage = totalPages - 4;
      endPage = totalPages;
    } else {
      startPage = currentPage - 2;
      endPage = currentPage + 2;
    }
  }

  for (let i = 1; i <= totalPages; i++) {
    // Only push numbers in the calculated range, or first/last with ellipses
    if (i === 1 || i === totalPages || (i >= startPage && i <= endPage)) {
        pageNumbers.push(i);
    }
  }


  const renderPageNumbers = pageNumbers.map((number, index, arr) => {
    // Add ellipsis logic
    if (index > 0 && number - arr[index-1] > 1) {
      // If there's a gap to the previous number, insert an ellipsis
      return (
        <React.Fragment key={`ellipsis_before_${number}`}>
          <li>
            <span className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
          </li>
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`py-2 px-3 leading-tight border border-gray-300 ${
                currentPage === number
                  ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 z-10'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {number}
            </button>
          </li>
        </React.Fragment>
      );
    }
    return (
      <li key={number}>
        <button
          onClick={() => paginate(number)}
          className={`py-2 px-3 leading-tight border border-gray-300 ${
            currentPage === number
              ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 z-10'
              : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {number}
        </button>
      </li>
    );
  });


  return (
    <nav aria-label="Page navigation">
      <ul className="inline-flex items-center -space-x-px text-sm">
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Trước
          </button>
        </li>
        {renderPageNumbers}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;