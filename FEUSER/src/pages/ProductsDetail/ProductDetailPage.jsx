// src/pages/ProductDetailPage.jsx (hoặc nơi bạn đặt file này)

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // <-- 1. Import useParams
import axios from 'axios';                   // <-- 2. Import axios

import Breadcrumbs from './Breadcrumbs';         
import ImageGallery from './ImageGallery';       
import ProductDescription from './ProductDescription'; 
import ProductInfo from './ProductInfo';                          
import ProductReviews from './ProductReviews'; 

// --- 3. Tạo hàm chuyển đổi dữ liệu ---
/**
 * Chuyển đổi dữ liệu từ API thành định dạng mà các component FE mong đợi.
 * @param {object} apiData Dữ liệu thô từ API response.
 * @returns {object} Dữ liệu đã được định dạng cho component.
 */
const transformApiDataToComponentProps = (apiData) => {
  if (!apiData) return null;

  // Chuyển đổi `colorOptions` và `sizeOptions`
  const colors = apiData.colorOptions.map(color => ({
    ...color, // Giữ lại id, name, price, image_urls từ API
    hex: '#000000', // API không có mã hex, ta có thể tạo placeholder hoặc bỏ qua
    image: color.image_urls?.[0] || apiData.image_url, // Lấy ảnh đầu tiên của màu hoặc ảnh chính của sản phẩm
  }));

  const availableSizes = apiData.sizeOptions.map(size => size.name);

  // Tạo breadcrumbs động
  const breadcrumbs = [
    { name: 'Trang chủ', href: '/' },
    { name: apiData.category?.name || 'Danh mục', href: `/category/${apiData.category?.id}` },
    { name: apiData.name, href: '#' }
  ];

  // Tạo danh sách ảnh cho gallery ban đầu (từ màu đầu tiên)
  const initialImages = colors[0]?.image_urls.map((url, index) => ({
      id: `${colors[0].id}-${index}`,
      src: url,
      alt: `${apiData.name} - ${colors[0].name} - view ${index + 1}`
  })) || [{ id: 'main', src: apiData.image_url, alt: 'Main product image'}];
  
  // Xử lý description: API chỉ trả về string, component cần object phức tạp
  // => Ta sẽ tạo một cấu trúc mặc định và chèn mô tả từ API vào.
  const description = {
    features: [
        { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip6_26.png', title: 'Co giãn' },
        { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip17_68.png', title: 'Thoáng mát' },
    ],
    specs: [{ label: 'CHẤT LIỆU', value: 'Vải cao cấp' }],
    proudlyMadeIn: 'Proudly Made In Vietnam',
    sections: [
        { type: 'paragraph', text: apiData.description }, // <-- Dùng mô tả từ API
        { type: 'image', src: 'https://mcdn.coolmate.me//image/March2025/ao-polo-nam-pique-cotton-thumb-1.png', alt: 'Polo description image 1'},
    ],
    stylingTips: { title: 'Gợi ý phối đồ', items: ['Phối với quần Jean', 'Phối với quần Kaki'] }
  };
  
  // Kết hợp và trả về
  return {
    id: apiData.id,
    name: apiData.name,
    subTitle: apiData.category?.name || '',
    price: parseFloat(apiData.price), // Chuyển đổi sang số
    originalPrice: parseFloat(apiData.price) * 1.25, // Tạo giá gốc giả để hiển thị giảm giá
    rating: 4.8, // Dữ liệu giả vì API không có
    reviewCount: 150, // Dữ liệu giả
    freeship: true, // Dữ liệu giả
    vouchers: ['Giảm 555k', 'Giảm 255k'], // Dữ liệu giả
    offerBannerImage: 'https://media3.coolmate.me/cdn-cgi/image/width=713,height=1050,quality=85,format=auto/uploads/May2025/footer_voucher_555.jpg', // Dữ liệu giả
    policies: [
      { icon: 'box', text: 'Được hoàn tiền đến 17.000 CoolCash.', detailsLink: '#' },
      { icon: 'chat', text: 'Chat để được Coolmate tư vấn ngay (8:30 - 22:00)', link: '#' },
    ],
    detailedPolicies: [
        { icon: 'https://www.coolmate.me/images/product-detail/return.svg', text: 'Đổi trả cực dễ chỉ cần số điện thoại' },
        { icon: 'https://www.coolmate.me/images/product-detail/return-60.svg', text: '60 ngày đổi trả vì bất kỳ lý do gì' },
    ],
    breadcrumbs,
    images: initialImages, // Dùng để khởi tạo gallery
    colors,
    availableSizes,
    description,
    reviews: { // Dữ liệu giả
        averageRating: 4.8,
        totalReviews: 234,
        reviewsList: [
            { id: 1, email: "dinhanhtravelbg@gmail.com", date: "03.05.2025", rating: 5, comment: "Chất liệu và phom dáng chưa bao giờ làm mình thất vọng" },
            { id: 2, email: "anotheruser@example.com", date: "02.05.2025", rating: 4, comment: "Sản phẩm tốt, giao hàng nhanh. Sẽ ủng hộ tiếp!" },
        ]
    }
  };
};


// Placeholder components (giữ nguyên)
const RelatedProducts = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Gợi ý sản phẩm</h2>{/* Carousel/Grid UI */}</div> : null;
const RecentlyViewed = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Sản phẩm đã xem</h2>{/* Carousel/Grid UI */}</div> : null;


function ProductDetailPage() {
  const { id: productId } = useParams(); // <-- 4. Lấy ID sản phẩm từ URL
  
  const [product, setProduct] = useState(null);                
  const [isLoading, setIsLoading] = useState(true);             
  const [error, setError] = useState(null);                     // <-- State cho lỗi
  const [selectedColor, setSelectedColor] = useState(null);     
  const [selectedSize, setSelectedSize] = useState(null);       
  const [quantity, setQuantity] = useState(1);
  const [galleryImages, setGalleryImages] = useState([]); // <-- State riêng cho ảnh gallery

  useEffect(() => {
    // --- 5. Logic gọi API ---
    const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3000/api/products/${productId}/details`);
            if (response.data.success) {
                const transformedData = transformApiDataToComponentProps(response.data.data);
                setProduct(transformedData);

                // Thiết lập state ban đầu
                if (transformedData?.colors?.length > 0) {
                    const initialColor = transformedData.colors[0];
                    setSelectedColor(initialColor);
                    // Cập nhật gallery với ảnh của màu đầu tiên
                    const initialGalleryImages = initialColor.image_urls.map((url, index) => ({
                        id: `${initialColor.id}-${index}`,
                        src: url,
                        alt: `${transformedData.name} - ${initialColor.name} - view ${index + 1}`
                    }));
                    setGalleryImages(initialGalleryImages);
                } else {
                    // Nếu không có màu, dùng ảnh chính
                    setGalleryImages(transformedData.images);
                }
            } else {
                setError('Không thể tải dữ liệu sản phẩm.');
            }
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
            setError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (productId) {
        fetchProduct();
    }
  }, [productId]); 

  // --- 6. Cập nhật handler chọn màu ---
  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null); // Reset size khi chọn màu mới

    // Cập nhật ảnh trong gallery theo màu đã chọn
    const newGalleryImages = color.image_urls.map((url, index) => ({
        id: `${color.id}-${index}`,
        src: url,
        alt: `${product.name} - ${color.name} - view ${index + 1}`
    }));
    setGalleryImages(newGalleryImages);
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
       colorId: selectedColor.id, // Lấy ID màu từ API
       sizeName: selectedSize,     // Lấy tên size
       quantity: quantity,
       price: selectedColor.price || product.price, // Ưu tiên giá của màu, nếu không có thì lấy giá sản phẩm
       image: selectedColor.image || product.images?.[0]?.src
    };
    console.log("Adding to cart:", cartItem);
    alert(`Đã thêm ${quantity} "${product.name}" (${selectedColor.name} / ${selectedSize}) vào giỏ hàng!`);
  }

  // --- 7. Cập nhật phần render ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-600 font-semibold">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-10 text-gray-600">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="bg-white">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          {product.breadcrumbs && <Breadcrumbs items={product.breadcrumbs} />}
          <div className="lg:flex lg:items-start lg:gap-x-8 mt-6">
            <ImageGallery images={galleryImages} offerBanner={product.offerBannerImage} /> {/* Sử dụng galleryImages */}
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

        {product.reviews && product.reviews.reviewsList && product.reviews.reviewsList.length > 0 ? (
          <div className="mt-12 lg:mt-16">
            <ProductReviews 
              averageRating={product.reviews.averageRating}
              totalReviews={product.reviews.totalReviews}
              reviewsList={product.reviews.reviewsList}
            />
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16"> 
          <RelatedProducts products={product.relatedProducts || []} />
          <RecentlyViewed products={product.recentlyViewed || []} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;