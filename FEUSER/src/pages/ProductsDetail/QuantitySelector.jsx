import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

const QuantitySelector = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="px-3 py-2 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="px-4 py-1.5 text-sm font-medium border-l border-r border-gray-300 w-12 text-center">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        className="px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-r"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;