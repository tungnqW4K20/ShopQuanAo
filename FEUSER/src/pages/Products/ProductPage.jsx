
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import { categories, sizes, colors as colorsData, products as allProducts } from './data'; // Import ALL dummy data

const ITEMS_PER_PAGE = 8; // How many items to load each time

function ProductPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false); // For load more button state

  // Filter State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);

  // Sorting State
  const [sortOrder, setSortOrder] = useState('ban-chay'); // Default sort

  // Pagination State
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Simulate initial data fetch
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300); // Shorter delay now
    return () => clearTimeout(timer);
  }, []);

  // --- Filtering Logic ---
  const filteredProducts = useMemo(() => {
    let products = [...allProducts]; // Start with a copy of all products

    // Category Filter
    if (selectedCategory) {
      products = products.filter(p => p.categoryId === selectedCategory);
    }

    // Size Filter (Product must have AT LEAST ONE of the selected sizes)
    if (selectedSizes.length > 0) {
      products = products.filter(p =>
        p.availableSizes && selectedSizes.some(s => p.availableSizes.includes(s))
      );
    }

    // Color Filter (Product must have AT LEAST ONE of the selected colors)
    if (selectedColors.length > 0) {
       products = products.filter(p =>
         p.colors && selectedColors.some(selColor => p.colors.includes(selColor))
      );
    }

    // --- Sorting Logic ---
    switch (sortOrder) {
        case 'gia-thap-cao':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'gia-cao-thap':
             products.sort((a, b) => b.price - a.price);
            break;
        case 'moi-nhat':
            // Assuming higher ID means newer, adjust if you have a real date
             products.sort((a, b) => b.id - a.id);
            break;
        case 'ban-chay': // Default - Assuming data is pre-sorted or use reviews/rating
             products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0)); // Example: sort by reviews desc
            break;
        default:
            // Keep original order or default to 'ban-chay'
             products.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
            break;
    }


    return products;
  }, [selectedCategory, selectedSizes, selectedColors, sortOrder]); // Rerun when filters or sort changes

  // --- Reset pagination when filters change ---
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE); // Reset visible count when filters change
  }, [selectedCategory, selectedSizes, selectedColors, sortOrder]); // Also reset on sort change

  // --- Handlers ---
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleSizeChange = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorChange = (colorHex) => {
    setSelectedColors(prev =>
      prev.includes(colorHex) ? prev.filter(c => c !== colorHex) : [...prev, c]
    );
  };

   const handleSortChange = (newSortOrder) => {
      setSortOrder(newSortOrder);
   }

   const handleClearFilters = () => {
       setSelectedCategory(null);
       setSelectedSizes([]);
       setSelectedColors([]);
       // Optionally reset sort order too, or keep it
       // setSortOrder('ban-chay');
   }

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate network delay for loading more
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 300); // Simulate delay
  };

  // Products to actually display based on pagination
  const productsToDisplay = useMemo(() => {
      return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row">
        <Sidebar
          categories={categories}
          sizes={sizes}
          colorsData={colorsData}
          selectedCategory={selectedCategory}
          selectedSizes={selectedSizes}
          selectedColors={selectedColors}
          onCategoryChange={handleCategoryChange}
          onSizeChange={handleSizeChange}
          onColorChange={handleColorChange}
          onClearFilters={handleClearFilters} // Pass clear handler
        />

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center min-h-[400px]">
            {/* Add a better spinner component here */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <ProductGrid
            products={productsToDisplay}
            totalFilteredCount={filteredProducts.length}
            visibleCount={productsToDisplay.length} // Pass the *actual* number shown
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            selectedSort={sortOrder}
            onSortChange={handleSortChange} // Pass sort handler
          />
        )}
      </div>
       {/* Floating Zalo Button */}
       <button className="fixed bottom-5 right-5 z-50 bg-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors duration-200">
         <img src="/images/zalo-icon.svg" alt="Zalo" className="h-6 w-6" /> {/* Use your Zalo icon */}
       </button>
    </div>
  );
}

export default ProductPage;