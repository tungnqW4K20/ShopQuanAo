import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  // Logic for displaying a limited number of page buttons
  // For simplicity, showing first, current, last and ellipses
  const maxPagesToShow = 5;
  let startPage, endPage;

  if (totalPages <= maxPagesToShow) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const maxPagesBeforeCurrentPage = Math.floor(maxPagesToShow / 2);
    const maxPagesAfterCurrentPage = Math.ceil(maxPagesToShow / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      startPage = 1;
      endPage = maxPagesToShow;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      startPage = totalPages - maxPagesToShow + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }


  return (
    <nav aria-label="Page navigation" className="flex justify-center mt-6 mb-4">
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Trước
          </button>
        </li>
        {startPage > 1 && (
          <>
            <li>
              <button
                onClick={() => onPageChange(1)}
                className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
              >
                1
              </button>
            </li>
            {startPage > 2 && (
              <li>
                <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
              </li>
            )}
          </>
        )}
        {pageNumbers.map(number => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`px-3 py-2 leading-tight border border-gray-300 ${
                currentPage === number
                  ? 'text-indigo-600 bg-indigo-50 border-indigo-300 hover:bg-indigo-100 hover:text-indigo-700'
                  : 'text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {number}
            </button>
          </li>
        ))}
         {endPage < totalPages && (
          <>
            {endPage < totalPages -1 && (
              <li>
                <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
              </li>
            )}
            <li>
              <button
                onClick={() => onPageChange(totalPages)}
                className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700`}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}
        <li>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Sau
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;