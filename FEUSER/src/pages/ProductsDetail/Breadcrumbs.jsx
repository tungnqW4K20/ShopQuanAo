import React from 'react';
import { ChevronRightIcon } from '@heroicons/react/20/solid'; // Use smaller icons

const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
      <ol role="list" className="flex items-center space-x-1">
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            {index !== 0 && (
              <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" aria-hidden="true" />
            )}
            {index === items.length - 1 ? (
              <span className="font-medium text-gray-700">{item.name}</span>
            ) : (
              <a href={item.href} className="hover:text-gray-700">
                {item.name}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;