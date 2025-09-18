import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './Sidebar';
import ProductGrid from './ProductGrid';
import { sizes, colors as colorsData } from './data';

const ITEMS_PER_PAGE = 8;

const transformApiProduct = (apiProduct) => {
  return {
    id: apiProduct.id,
    name: apiProduct.name,
    imageUrl: apiProduct.image_url,
    price: parseFloat(apiProduct.price),
    originalPrice: null,
    rating: null,
    reviews: 0,
    colors: [],
    availableColorCount: 0,
    badge: apiProduct.featured ? 'BÁN CHẠY' : null,
    voucher: null,
    offerText: null,
    categoryId: apiProduct.category_id,
    createdAt: apiProduct.createdAt,
  };
};

function ProductPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0); 

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOrder, setSortOrder] = useState('ban-chay');

  const fetchProducts = useCallback(async (page, category, isNewQuery = false) => {
    if (isNewQuery) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    let apiUrl;
    if (category) {
      apiUrl = `https://benodejs-9.onrender.com/api/products/category/${category}?page=${page}&limit=${ITEMS_PER_PAGE}`;
    } else {
      apiUrl = `https://benodejs-9.onrender.com/api/products/?page=${page}&limit=${ITEMS_PER_PAGE}`;
    }

    

    try {
      debugger

      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      }
      const result = await response.json();

      if (result.success && result.data) {
        const transformedProducts = result.data.map(transformApiProduct);

        if (isNewQuery) {
          setAllProducts(transformedProducts);
        } else {
          setAllProducts(prev => [...prev, ...transformedProducts]);
        }
        
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalItems(result.pagination.totalItems); // Cập nhật tổng số sản phẩm
        }
      } else {
        throw new Error(result.message || "Định dạng API không hợp lệ");
      }
    } catch (err) {
      console.error("Lỗi khi tải sản phẩm:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []); 

  useEffect(() => {
    fetchProducts(1, selectedCategory, true);
  }, [selectedCategory, sortOrder, fetchProducts]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProducts(currentPage, selectedCategory, false);
    }
  }, [currentPage, selectedCategory, fetchProducts]);

  const processedProducts = useMemo(() => {
    let products = [...allProducts];

    
    if (selectedSizes.length > 0) {
    }
    if (selectedColors.length > 0) {
    }

    switch (sortOrder) {
        case 'gia-thap-cao':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'gia-cao-thap':
             products.sort((a, b) => b.price - a.price);
            break;
        case 'moi-nhat':
             products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'ban-chay': 
            break;
        default:
            break;
    }

    return products;
  }, [allProducts, selectedSizes, selectedColors, sortOrder]);


  
  const handleCategoryChange = (categoryId) => {
    setAllProducts([]);
    setCurrentPage(1);
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
    setAllProducts([]);
    setCurrentPage(1);
    setSortOrder(newSortOrder);
  };
  const handleClearFilters = () => {
    const filtersAreActive = selectedCategory || selectedSizes.length > 0 || selectedColors.length > 0;
    if (filtersAreActive) {
      setAllProducts([]);
      setCurrentPage(1);
    }
    setSelectedCategory(null);
    setSelectedSizes([]);
    setSelectedColors([]);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row">
        <Sidebar
          sizes={sizes}
          colorsData={colorsData}
          selectedCategory={selectedCategory}
          selectedSizes={selectedSizes}
          selectedColors={selectedColors}
          onCategoryChange={handleCategoryChange}
          onSizeChange={handleSizeChange}
          onColorChange={handleColorChange}
          onClearFilters={handleClearFilters}
        />

        {isLoading ? (
          <div className="flex-1 flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
           <div className="flex-1 flex justify-center items-center min-h-[400px]">
             <p className="text-red-600">Lỗi tải dữ liệu: {error}</p>
           </div>
        ) : (
          <ProductGrid
            products={processedProducts}
            totalFilteredCount={totalItems} 
            visibleCount={processedProducts.length} 
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
            selectedSort={sortOrder}
            onSortChange={handleSortChange}
            canLoadMore={currentPage < totalPages && !isLoadingMore}
          />
        )}
      </div>
      <button className="fixed bottom-5 right-5 z-50 bg-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-600 transition-colors duration-200">
        <img src="/images/zalo-icon.svg" alt="Zalo" className="h-6 w-6" />
      </button>
    </div>
  );
}

export default ProductPage;