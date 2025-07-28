import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';

const QuantitySelector = ({ quantity, onDecrease, onIncrease, min = 1, max = 99, isLoadingCart }) => {
  return (
    <div className="flex items-center border border-gray-300 rounded">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min || isLoadingCart}
        className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l focus:outline-none focus:ring-1 focus:ring-indigo-500"
        aria-label="Decrease quantity"

      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="px-3 py-0.5 text-sm font-medium border-l border-r border-gray-300 w-10 text-center select-none">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max || isLoadingCart}
        className="px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r focus:outline-none focus:ring-1 focus:ring-indigo-500"
        aria-label="Increase quantity"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

export default QuantitySelector;