import React, { useState, useEffect } from 'react';
import Breadcrumbs from './Breadcrumbs';         
import ImageGallery from './ImageGallery';       
import ProductDescription from './ProductDescription'; 
import ProductInfo from './ProductInfo';                          
import { product as productDetailData } from './productDetailData'; 
import ProductReviews from './ProductReviews'; // <--- 1. IMPORT THE COMPONENT

// Placeholder components for Related and Recently Viewed sections
const RelatedProducts = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Gợi ý sản phẩm</h2>{/* Carousel/Grid UI for related products */}</div> : null;
const RecentlyViewed = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Sản phẩm đã xem</h2>{/* Carousel/Grid UI for recently viewed products */}</div> : null;

function ProductDetailPage() {
  const [product, setProduct] = useState(null);                
  const [isLoading, setIsLoading] = useState(true);             
  const [selectedColor, setSelectedColor] = useState(null);     
  const [selectedSize, setSelectedSize] = useState(null);       
  const [quantity, setQuantity] = useState(1);                  

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      const mockProductData = {
        ...productDetailData,
        // Ensure your productDetailData has a 'reviews' object structured as expected by ProductReviews
        reviews: productDetailData.reviews || { // Default structure if not present in productDetailData
          averageRating: 4.8,
          totalReviews: 234, // Example total
          reviewsList: [
             { id: 1, email: "dinhanhtravelbg@gmail.com", date: "03.05.2025", rating: 5, comment: "Chất liệu và phom dáng chưa bao giờ làm mình thất vọng" },
             { id: 2, email: "anotheruser@example.com", date: "02.05.2025", rating: 4, comment: "Sản phẩm tốt, giao hàng nhanh. Sẽ ủng hộ tiếp!" },
             { id: 3, email: "testcustomer@email.com", date: "01.05.2025", rating: 5, comment: "Tuyệt vời! Rất đáng tiền. Chất vải mát, mặc thoải mái." },
             { id: 4, email: "happybuyer@shop.com", date: "30.04.2025", rating: 3, comment: "Chất lượng ổn so với giá, tuy nhiên màu sắc hơi khác so với ảnh." },
             // Add more reviews if your ProductReviews component expects more for pagination/display
          ]
        }
      };
      setProduct(mockProductData);

      if (mockProductData?.colors?.length > 0) {
         setSelectedColor(mockProductData.colors[0]);
      }
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []); 

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); 
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) { 
       setQuantity(newQuantity);
    }
  }

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
       alert("Vui lòng chọn Màu sắc và Kích thước!");
       return;
    }
    const cartItem = {
       productId: product.id,
       name: product.name,
       color: selectedColor.name,
       hex: selectedColor.hex,
       size: selectedSize,
       quantity: quantity,
       price: product.price,
       image: selectedColor.image || product.images?.[0]?.src || null 
    };
    console.log("Adding to cart:", cartItem);
    alert(`Đã thêm ${quantity} "${product.name}" (${selectedColor.name} / ${selectedSize}) vào giỏ hàng!`);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-10 text-gray-600">Không tìm thấy sản phẩm.</div>;
  }

  // --- Prepare Data for Reviews Component ---
  // This part looks good for preparing data for ProductReviews
  const reviewsComponentData = product.reviews; // Assuming product.reviews directly matches what ProductReviews expects

  return (
    <div className="bg-white">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {product.breadcrumbs && <Breadcrumbs items={product.breadcrumbs} />}
          <div className="lg:flex lg:items-start lg:gap-x-8 mt-6">
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
        
        {product.description && <ProductDescription description={product.description} />}

        {/* --- 2. USE THE ProductReviews COMPONENT --- */}
        {/* 
          The ProductReviews component expects props like:
          - averageRating
          - totalReviews
          - reviewsList (array of review objects)
          Your `product.reviews` object should contain these.
        */}
        {product.reviews && product.reviews.reviewsList && product.reviews.reviewsList.length > 0 ? (
          // The ProductReviews component itself will handle its own internal structure and max-width.
          // We might want to wrap it in a div for consistent spacing or background if needed.
          <div className="mt-12 lg:mt-16"> {/* Add top margin for spacing */}
            {/* 
              Pass the necessary props. The ProductReviews component uses reviewsData.
              Let's ensure the data structure matches.
              The ProductReviews component expects a single prop `reviewsData` which is an object:
              { averageRating, totalReviews, reviewsList }
            */}
            <ProductReviews 
              // Pass the whole reviews object if it matches the structure
              // Otherwise, destructure and pass individual props
              averageRating={product.reviews.averageRating}
              totalReviews={product.reviews.totalReviews}
              reviewsList={product.reviews.reviewsList}
            />
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</div>
        )}
        {/* --- END OF ProductReviews INTEGRATION --- */}


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16"> 
          <RelatedProducts products={product.relatedProducts || []} />
          <RecentlyViewed products={product.recentlyViewed || []} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;