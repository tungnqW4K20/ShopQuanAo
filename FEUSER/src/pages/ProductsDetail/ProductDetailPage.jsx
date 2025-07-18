import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Import hook xác thực

// Import các component con
import Breadcrumbs from './Breadcrumbs';         
import ImageGallery from './ImageGallery';       
import ProductDescription from './ProductDescription'; 
import ProductInfo from './ProductInfo';                          
import ProductReviews from './ProductReviews'; 

// Hàm chuyển đổi dữ liệu từ API sang định dạng component cần
const transformApiDataToComponentProps = (apiData) => {
  if (!apiData) return null;

  const colors = apiData.colorOptions.map(color => ({
    ...color,
    hex: color.colorCode || '#000000',
    image: color.image_urls?.[0] || apiData.image_url,
  }));
  
  // *** QUAN TRỌNG: Giữ lại toàn bộ object size để lấy được ID ***
  const availableSizes = apiData.sizeOptions;

  const breadcrumbs = [
    { name: 'Trang chủ', href: '/' },
    { name: apiData.category?.name || 'Danh mục', href: `/category/${apiData.category?.id}` },
    { name: apiData.name, href: '#' }
  ];

  const initialImages = colors[0]?.image_urls.map((url, index) => ({
      id: `${colors[0].id}-${index}`,
      src: url,
      alt: `${apiData.name} - ${colors[0].name} - view ${index + 1}`
  })) || [{ id: 'main', src: apiData.image_url, alt: 'Main product image'}];
  
  const description = {
    features: [
        { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip6_26.png', title: 'Co giãn' },
        { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip17_68.png', title: 'Thoáng mát' },
    ],
    specs: [{ label: 'CHẤT LIỆU', value: 'Vải cao cấp' }],
    proudlyMadeIn: 'Proudly Made In Vietnam',
    sections: [
        { type: 'paragraph', text: apiData.description },
        { type: 'image', src: 'https://mcdn.coolmate.me//image/March2025/ao-polo-nam-pique-cotton-thumb-1.png', alt: 'Polo description image 1'},
    ],
    stylingTips: { title: 'Gợi ý phối đồ', items: ['Phối với quần Jean', 'Phối với quần Kaki'] }
  };
  
  return {
    id: apiData.id,
    name: apiData.name,
    subTitle: apiData.category?.name || '',
    price: parseFloat(apiData.price),
    originalPrice: parseFloat(apiData.price) * 1.25,
    rating: 4.8,
    reviewCount: 150,
    freeship: true,
    vouchers: ['Giảm 555k', 'Giảm 255k'],
    offerBannerImage: 'https://media3.coolmate.me/cdn-cgi/image/width=713,height=1050,quality=85,format=auto/uploads/May2025/footer_voucher_555.jpg',
    policies: [
      { icon: 'box', text: 'Được hoàn tiền đến 17.000 CoolCash.', detailsLink: '#' },
      { icon: 'chat', text: 'Chat để được Coolmate tư vấn ngay (8:30 - 22:00)', link: '#' },
    ],
    detailedPolicies: [
        { icon: 'https://www.coolmate.me/images/product-detail/return.svg', text: 'Đổi trả cực dễ chỉ cần số điện thoại' },
        { icon: 'https://www.coolmate.me/images/product-detail/return-60.svg', text: '60 ngày đổi trả vì bất kỳ lý do gì' },
    ],
    breadcrumbs,
    images: initialImages,
    colors,
    availableSizes,
    description,
    reviews: {
        averageRating: 4.8,
        totalReviews: 234,
        reviewsList: [
            { id: 1, email: "dinhanhtravelbg@gmail.com", date: "03.05.2025", rating: 5, comment: "Chất liệu và phom dáng chưa bao giờ làm mình thất vọng" },
            { id: 2, email: "anotheruser@example.com", date: "02.05.2025", rating: 4, comment: "Sản phẩm tốt, giao hàng nhanh. Sẽ ủng hộ tiếp!" },
        ]
    }
  };
};

// Placeholder components
const RelatedProducts = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Gợi ý sản phẩm</h2>{/* Carousel/Grid UI */}</div> : null;
const RecentlyViewed = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Sản phẩm đã xem</h2>{/* Carousel/Grid UI */}</div> : null;


function ProductDetailPage() {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  
  const [product, setProduct] = useState(null);                
  const [isLoading, setIsLoading] = useState(true);             
  const [error, setError] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false); // State cho nút "Thêm vào giỏ"

  const [selectedColor, setSelectedColor] = useState(null);     
  const [selectedSize, setSelectedSize] = useState(null); // Sẽ lưu cả object size     
  const [quantity, setQuantity] = useState(1);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:3000/api/products/${productId}/details`);
            if (response.data.success) {
                const transformedData = transformApiDataToComponentProps(response.data.data);
                setProduct(transformedData);

                if (transformedData?.colors?.length > 0) {
                    const initialColor = transformedData.colors[0];
                    setSelectedColor(initialColor);
                    const initialGalleryImages = initialColor.image_urls.map((url, index) => ({
                        id: `${initialColor.id}-${index}`,
                        src: url,
                        alt: `${transformedData.name} - ${initialColor.name} - view ${index + 1}`
                    }));
                    setGalleryImages(initialGalleryImages);
                } else {
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

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedSize(null);
    const newGalleryImages = color.image_urls.map((url, index) => ({
        id: `${color.id}-${index}`,
        src: url,
        alt: `${product.name} - ${color.name} - view ${index + 1}`
    }));
    setGalleryImages(newGalleryImages);
  };

  const handleSizeSelect = (size) => { // size là object { id, name, ... }
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) { 
       setQuantity(newQuantity);
    }
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
       alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
       navigate('/login');
       return;
    }

    if (!selectedColor || !selectedSize) {
       alert("Vui lòng chọn Màu sắc và Kích thước!");
       return;
    }

    setIsAddingToCart(true);

    const cartItemPayload = {
       product_id: product.id,
       color_product_id: selectedColor.id,
       size_product_id: selectedSize.id,
       quantity: quantity,
    };
    
    try {
        const response = await axios.post('http://localhost:3000/api/carts', cartItemPayload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.data.success) {
            console.log('API Response:', response.data);
            alert(`Thêm thành công: ${quantity} x "${response.data.data.product.name}" (${response.data.data.colorVariant.name} / ${response.data.data.sizeVariant.name})`);
        } else {
            alert(`Lỗi: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        alert(`Đã xảy ra lỗi: ${error.response?.data?.message || 'Không thể kết nối đến máy chủ.'}`);
    } finally {
        setIsAddingToCart(false);
    }
  }

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
            <ImageGallery images={galleryImages} offerBanner={product.offerBannerImage} />
            <ProductInfo
              product={product}
              selectedColor={selectedColor}
              onColorSelect={handleColorSelect}
              selectedSize={selectedSize}
              onSizeSelect={handleSizeSelect}
              quantity={quantity}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              isAddingToCart={isAddingToCart}
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