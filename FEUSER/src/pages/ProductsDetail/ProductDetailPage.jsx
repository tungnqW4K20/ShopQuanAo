import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom'; // Uncomment if using routing

// --- Import Components ---
// Adjust paths based on your actual folder structure.
// Assuming ProductDetailPage.jsx is in 'src/pages/ProductsDetail/'
// and other components are in 'src/components/'

import Breadcrumbs from './Breadcrumbs';         // For navigation path
import ImageGallery from './ImageGallery';       // For product images
import ProductDescription from './ProductDescription'; // For description section
import ProductReviews from './ProductReviews';       // For reviews section
import ProductInfo from './ProductInfo';                          // For product details, options, cart (assuming in same folder)

// --- Import Mock Data ---
// Replace with actual API call in a real application
import { product as productDetailData } from './productDetailData'; // Assuming data is in same folder

// --- Placeholder Components for other sections ---
// Replace with your actual implementations later
const RelatedProducts = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Gợi ý sản phẩm</h2>{/* Carousel/Grid UI */}</div> : null;
const RecentlyViewed = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Sản phẩm đã xem</h2>{/* Carousel/Grid UI */}</div> : null;

// --- Main Page Component ---
function ProductDetailPage() {
  // const { productId } = useParams(); // Uncomment if using routing

  // --- State Variables ---
  const [product, setProduct] = useState(null);                // Holds the fetched product data
  const [isLoading, setIsLoading] = useState(true);             // Loading state flag
  const [selectedColor, setSelectedColor] = useState(null);     // Currently selected color object
  const [selectedSize, setSelectedSize] = useState(null);       // Currently selected size string
  const [quantity, setQuantity] = useState(1);                  // Quantity to add to cart

  // --- Data Fetching Simulation ---
  useEffect(() => {
    setIsLoading(true);
    // TODO: In a real app, replace this timeout with an API call
    // fetch(`/api/products/${productId || productDetailData.id}`).then(res => res.json()).then(data => { ... })
    const timer = setTimeout(() => {
      // --- Add sample review data to mock data if it doesn't exist ---
      // This ensures the reviews component has data for testing
      const mockProductData = {
        ...productDetailData,
        reviews: productDetailData.reviews || { // Ensure reviews object exists
          averageRating: 4.8,
          totalReviews: 274,
          reviewsList: [
             { id: 1, authorName: "Thảo", date: "29.04.2025", rating: 5, comment: "Giá tốt, giao hàng nhanh, áo mặc mát mẻ. Ok nha", hasReply: false, images: [] },
             { id: 2, authorName: "Thảo", date: "29.04.2025", rating: 5, comment: "Giá tốt, giao hàng nhanh, áo mặc mát mẻ. Ok nha", hasReply: true, images: [] },
             { id: 3, authorName: "Truong Tien Dat", date: "07.04.2025", rating: 5, comment: "Sản phẩm đẹp, đúng sản phẩm đã đặt, giao hàng nhanh", hasReply: false, images: ['/images/review-placeholder.png'] }, // Replace with actual/placeholder image path
             { id: 4, authorName: "Thảo", date: "17.04.2025", rating: 4, comment: "Sản phẩm tốt, giá cả cạnh tranh, cskh tuyệt vời", hasReply: false, images: [] },
             { id: 5, authorName: "Anh Khoa", date: "15.03.2025", rating: 3, comment: "Áo ổn nhưng màu hơi khác so với ảnh.", hasReply: false, images: [] },
             { id: 6, authorName: "Minh", date: "01.03.2025", rating: 5, comment: "Mua lần thứ 3 rồi, rất hài lòng!", hasReply: true, images: ['/images/review-placeholder.png', '/images/review-placeholder.png'] }, // Replace with actual/placeholder image paths
             // Add more mock reviews if needed
          ]
        }
      };
      // --- End sample review data addition ---

      setProduct(mockProductData);

      // Set initial color selection
      if (mockProductData?.colors?.length > 0) {
         setSelectedColor(mockProductData.colors[0]);
      }
      setIsLoading(false);
    }, 500); // Simulate network delay

    // Cleanup function
    return () => clearTimeout(timer);
    // }, [productId]); // Add productId dependency if using routing
  }, []); // Empty dependency array for mock data loading once

  // --- Event Handlers ---
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size when color changes
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) { // Basic validation
       setQuantity(newQuantity);
    }
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
       alert("Vui lòng chọn Màu sắc và Kích thước!");
       return;
    }
    // Prepare item data for cart
    const cartItem = {
       productId: product.id,
       name: product.name,
       color: selectedColor.name,
       hex: selectedColor.hex,
       size: selectedSize,
       quantity: quantity,
       price: product.price,
       image: selectedColor.image || product.images?.[0]?.src || null // Use color image or first main image
    };
    console.log("Adding to cart:", cartItem);
    // TODO: Implement actual add to cart logic (e.g., update context, call API)
    alert(`Đã thêm ${quantity} "${product.name}" (${selectedColor.name} / ${selectedSize}) vào giỏ hàng!`);
  }

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        {/* Simple spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // --- Product Not Found State ---
  if (!product) {
    return <div className="text-center py-10 text-gray-600">Không tìm thấy sản phẩm.</div>;
  }

  // --- Prepare Data for Reviews Component ---
  // Extracts review data safely and provides defaults
  const reviewsComponentData = product.reviews && product.reviews.reviewsList?.length > 0
    ? {
        averageRating: product.reviews.averageRating || 0,
        totalReviews: product.reviews.totalReviews || 0,
        reviewsList: product.reviews.reviewsList || [],
      }
    : null; // Render nothing if no review data

  // --- Render UI ---
  return (
    // Use white background for areas not covered by specific components
    <div className="bg-white">

      {/* Use a basic div wrapper; specific sections will manage their own containers/backgrounds */}
      <div>

        {/* Container for Top Sections (Breadcrumbs, Product Info/Gallery) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {/* Breadcrumbs */}
          {product.breadcrumbs && <Breadcrumbs items={product.breadcrumbs} />}

          {/* Main Product Section (Gallery + Info) */}
          <div className="lg:flex lg:items-start lg:gap-x-8 mt-6"> {/* Added mt-6 */}
            <ImageGallery images={product.images} offerBanner={product.offerBannerImage} />
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
              selectedSize={selectedSize}
              onSizeSelect={handleSizeSelect}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
            />
          </div>
        </div>
        {/* End Container for Top Sections */}


        {/* Sections that manage their own background/container */}
        {/* Description Section */}
        {product.description && <ProductDescription description={product.description} />}

        {/* Product Reviews Section */}
        {/* Render only if there's review data */}
        {reviewsComponentData && <ProductReviews reviewsData={reviewsComponentData} />}


        {/* Container for Bottom Sections (Related, Recently Viewed) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16"> {/* Added bottom padding */}
          {/* Related Products */}
          {/* Pass actual related product data here */}
          <RelatedProducts products={product.relatedProducts || []} />

          {/* Recently Viewed Products */}
          {/* Pass actual recently viewed data here */}
          <RecentlyViewed products={product.recentlyViewed || []} />
        </div>
        {/* End Container for Bottom Sections */}

      </div>

    </div>
  );
}

export default ProductDetailPage;