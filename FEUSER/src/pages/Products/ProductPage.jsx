import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryIdFromUrl = searchParams.get('categoryId');
  const searchKeywordFromUrl = searchParams.get('search');

  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [sortOrder, setSortOrder] = useState('ban-chay');
  
  const fetchProducts = useCallback(async (page, category, keyword, isNewQuery = false) => {
    if (isNewQuery) { setIsLoading(true); } else { setIsLoadingMore(true); }
    setError(null);

    let apiUrl;
    if (keyword) {
      apiUrl = `https://benodejs-9.onrender.com/api/products/search?search=${keyword}&page=${page}&limit=${ITEMS_PER_PAGE}`;
    } 
    else if (category) {
      apiUrl = `https://benodejs-9.onrender.com/api/products/category/${category}?page=${page}&limit=${ITEMS_PER_PAGE}`;
    } 
    else {
      apiUrl = `https://benodejs-9.onrender.com/api/products/?page=${page}&limit=${ITEMS_PER_PAGE}`;
    }

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
      const result = await response.json();

      if (result.success && result.data) {
        const transformedProducts = result.data.map(transformApiProduct);
        if (isNewQuery) { setAllProducts(transformedProducts); } 
        else { setAllProducts(prev => [...prev, ...transformedProducts]); }
        
        if (result.pagination) {
          setTotalPages(result.pagination.totalPages);
          setTotalItems(result.pagination.totalItems);
        } else {
            setTotalPages(1);
            setTotalItems(result.data.length);
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
    setCurrentPage(1); 
    setAllProducts([]); 
    fetchProducts(1, categoryIdFromUrl, searchKeywordFromUrl, true);
  }, [categoryIdFromUrl, searchKeywordFromUrl, sortOrder, fetchProducts]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchProducts(currentPage, categoryIdFromUrl, searchKeywordFromUrl, false);
    }
  }, [currentPage, categoryIdFromUrl, searchKeywordFromUrl, fetchProducts]);

  const processedProducts = useMemo(() => {
    let products = [...allProducts];
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
        default:
            break;
    }
    return products;
  }, [allProducts, sortOrder]);

  
  const handleCategoryChange = (categoryId) => {
    const newParams = new URLSearchParams(); 
    if (categoryId) {
      newParams.set('categoryId', categoryId);
    }
    setSearchParams(newParams);
  };
  
  const handleSortChange = (newSortOrder) => {
    setSortOrder(newSortOrder);
  };

  const handleClearFilters = () => {
    setSearchParams({}); 
    setSelectedSizes([]);
    setSelectedColors([]);
    setSortOrder('ban-chay');
  };

  const handleSizeChange = (size) => setSelectedSizes(p => p.includes(size) ? p.filter(s => s !== size) : [...p, size]);
  const handleColorChange = (colorHex) => setSelectedColors(p => p.includes(colorHex) ? p.filter(c => c !== colorHex) : [...p, c]);
  const handleLoadMore = () => { if (currentPage < totalPages) setCurrentPage(p => p + 1); };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="flex flex-col lg:flex-row">
        <Sidebar
          sizes={sizes}
          colorsData={colorsData}
          selectedCategory={categoryIdFromUrl} 
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