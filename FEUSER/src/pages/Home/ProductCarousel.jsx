import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import ProductCard from './ProductCard';

const CAROUSEL_TITLE = "SẢN PHẨM MẶC HẰNG NGÀY";
const SEE_MORE_LINK = "/care-share";
const API_ENDPOINT = 'https://benodejs-9.onrender.com/api/products/get-paginate-featured';
// --- THAY ĐỔI 1: Cập nhật PAGE_SIZE ---
const PAGE_SIZE = 6; // Số sản phẩm trên mỗi trang

const mapApiProductToCardProduct = (apiProduct) => ({
  id: String(apiProduct.id),
  name: apiProduct.name,
  imageUrl: apiProduct.image_url,
  link: `/product/${apiProduct.id}`,
  price: parseFloat(apiProduct.price),
  rating: null, isNew: false, colors: [], originalPrice: null, discountPercent: null,
});

const ProductCarousel = () => {
  const [products, setProducts] = useState([]);
  const [apiCurrentPage, setApiCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  const [visiblePageIndex, setVisiblePageIndex] = useState(0);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const calculateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  const fetchProducts = useCallback(async (pageToFetch) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("sssssss")
      const response = await fetch(`${API_ENDPOINT}?limit=${PAGE_SIZE}&page=${pageToFetch}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (result.success && result.data && result.data.length > 0) {
        setProducts(prevProducts => {
          const existingIds = new Set(prevProducts.map(p => p.id));
          const newUniqueProducts = result.data
            .map(mapApiProductToCardProduct)
            .filter(p => !existingIds.has(p.id));
          return [...prevProducts, ...newUniqueProducts];
        });
        const { currentPage, totalPages } = result.pagination;
        setApiCurrentPage(currentPage);
        setHasMoreProducts(currentPage < totalPages);
      } else {
        setHasMoreProducts(false);
      }
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm:", error);
      setHasMoreProducts(false);
    } finally {
      setIsLoading(false);
      if (!initialLoadDone) setInitialLoadDone(true);
    }
  }, [isLoading, initialLoadDone]);

  useEffect(() => {
    if (!initialLoadDone && products.length === 0) {
      fetchProducts(1);
    }
  }, [fetchProducts, initialLoadDone, products.length]);

  const changePage = useCallback((direction) => {
    if (direction === 'next') {
      const nextPageIndex = visiblePageIndex + 1;
      const productsNeeded = (nextPageIndex + 1) * PAGE_SIZE;

      if (products.length < productsNeeded && hasMoreProducts && !isLoading) {
        fetchProducts(apiCurrentPage + 1);
      }
      setVisiblePageIndex(nextPageIndex);
    } else if (direction === 'prev') {
      setVisiblePageIndex(prev => Math.max(0, prev - 1));
    }
  }, [visiblePageIndex, products.length, hasMoreProducts, isLoading, apiCurrentPage, fetchProducts]);

  // --- RENDER LOGIC ---
  const trackOffset = visiblePageIndex * containerWidth;
  const totalDisplayablePages = Math.ceil(products.length / PAGE_SIZE);
  const isAtStart = visiblePageIndex === 0;
  const isLastVisiblePage = visiblePageIndex >= totalDisplayablePages - 1;
  const isTrulyAtEnd = isLastVisiblePage && !hasMoreProducts;

  if (containerWidth === 0 || (!initialLoadDone && isLoading)) {
    return (
      <div className="container mx-auto px-8 py-8 sm:py-12" ref={containerRef}>
        <div className="flex justify-between items-center mb-5 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{CAROUSEL_TITLE}</h2>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">Đang tải...</div>
      </div>
    );
  }

  if (initialLoadDone && products.length === 0) {
    return (
      <div className="container mx-auto px-8 py-8 sm:py-12">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">{CAROUSEL_TITLE}</h2>
        <div className="text-center text-gray-500 py-10">Không có sản phẩm nào để hiển thị.</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-8 py-8 sm:py-12">
      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{CAROUSEL_TITLE}</h2>
        <Link to={SEE_MORE_LINK} className="text-sm font-medium text-gray-700 hover:text-blue-600">Xem Thêm</Link>
      </div>
      <div ref={containerRef} className="relative overflow-hidden">
        <button
          onClick={() => changePage('prev')}
          disabled={isAtStart}
          className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 bg-black p-2 rounded-full shadow-md hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${isAtStart ? 'opacity-0' : 'opacity-100'}`}
        >
          <FiChevronLeft className="w-5 h-5 text-white" />
        </button>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${trackOffset}px)` }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              // --- THAY ĐỔI 2: Tăng padding để tăng khoảng cách ---
              // px-2.5 -> 1.25rem, px-3 -> 1.5rem, ...
              className="flex-shrink-0 px-3 md:px-4" 
              style={{ width: `${100 / PAGE_SIZE}%` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
          {isLoading && (
            <div className="flex-shrink-0 flex items-center justify-center text-gray-500" style={{ width: `${100 / PAGE_SIZE}%` }}>
                ...
            </div>
          )}
        </div>
        <button
          onClick={() => changePage('next')}
          disabled={isTrulyAtEnd}
          className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 bg-black p-2 rounded-full shadow-md hover:bg-black/80 disabled:opacity-30 disabled:cursor-not-allowed transition-all ${isTrulyAtEnd ? 'opacity-0' : 'opacity-100'}`}
        >
          <FiChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};

export default ProductCarousel;