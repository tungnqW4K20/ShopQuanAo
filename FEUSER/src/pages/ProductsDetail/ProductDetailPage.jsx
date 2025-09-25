import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// Import các component con
import Breadcrumbs from './Breadcrumbs';
import ImageGallery from './ImageGallery';
import ProductDescription from './ProductDescription';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';
import { useCart } from '../../context/CartContext';

// Hàm chuyển đổi dữ liệu từ API sang định dạng component cần
const transformApiDataToComponentProps = (apiData) => {
    if (!apiData) return null;

    const colors = apiData.colorOptions.map(color => ({
        ...color,
        hex: color.colorCode || '#000000',
        image: color.image_urls?.[0] || apiData.image_url,
    }));

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
    })) || [{ id: 'main', src: apiData.image_url, alt: 'Main product image' }];

    const description = {
        features: [
            { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip6_26.png', title: 'Co giãn' },
            { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip17_68.png', title: 'Thoáng mát' },
        ],
        specs: [{ label: 'CHẤT LIỆU', value: 'Vải cao cấp' }],
        proudlyMadeIn: 'Proudly Made In Vietnam',
        sections: [
            { type: 'paragraph', text: apiData.description },
            { type: 'image', src: 'https://mcdn.coolmate.me//image/March2025/ao-polo-nam-pique-cotton-thumb-1.png', alt: 'Polo description image 1' },
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
    };
};

// Placeholder components
const RelatedProducts = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Gợi ý sản phẩm</h2>{/* Carousel/Grid UI */}</div> : null;
const RecentlyViewed = ({ products }) => products && products.length > 0 ? <div className="mt-16 lg:mt-24 border-t border-gray-200 pt-10"><h2 className="text-xl font-bold text-center mb-6">Sản phẩm đã xem</h2>{/* Carousel/Grid UI */}</div> : null;


function ProductDetailPage() {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, token, user } = useAuth(); 

    const [product, setProduct] = useState(null);
    const [comments, setComments] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);     
    const [quantity, setQuantity] = useState(1);
    const [galleryImages, setGalleryImages] = useState([]);

    const { addToCart, isLoading: isCartLoading } = useCart();

    useEffect(() => {
        const fetchProduct = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`https://benodejs-9.onrender.com/api/products/${productId}/details`);
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

    useEffect(() => {
        const fetchComments = async () => {
            if (productId) {
                try {
                    const response = await axios.get(`https://benodejs-9.onrender.com/api/comments/product/${productId}`);
                    if (response.data.success) {
                        setComments(response.data.data);
                    }
                } catch (err) {
                    console.error("Lỗi khi tải bình luận:", err);
                }
            }
        };
        fetchComments();
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

    const handleSizeSelect = (size) => {
        setSelectedSize(size);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1) {
            setQuantity(newQuantity);
        }
    }

    const handleAddToCart = async () => {
        if (!selectedColor || !selectedSize) {
            alert("Vui lòng chọn Màu sắc và Kích thước!");
            return;
        }

        // Dữ liệu payload luôn cần để gửi lên API (cho người dùng đã đăng nhập)
        const cartItemPayload = {
            product_id: product.id,
            color_product_id: selectedColor.id,
            size_product_id: selectedSize.id,
            quantity: quantity,
        };

        // Dữ liệu chi tiết này chỉ cần cho giỏ hàng local của khách
        // vì localStorage không thể tự lấy tên, hình ảnh, giá...
        const productDetailsForGuest = {
            name: product.name,
            image: selectedColor.image_urls?.[0] || product.images?.[0]?.src,
            color: selectedColor.name,
            size: selectedSize.name,
            price: product.price,
            originalPrice: product.originalPrice
        };

        try {
            // Truyền cả 2 object vào hàm addToCart trong context.
            // Context sẽ tự quyết định dùng dữ liệu nào dựa vào trạng thái đăng nhập.
            await addToCart(cartItemPayload, productDetailsForGuest);
            alert(`Đã thêm sản phẩm vào giỏ hàng!`);
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            alert(`Đã xảy ra lỗi: ${error.message || 'Không thể kết nối đến máy chủ.'}`);
        }
    }
    
    const handlePostComment = async (commentContent) => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để gửi bình luận!");
            navigate('/login');
            return;
        }
        if (!commentContent.trim()) {
            alert("Vui lòng nhập nội dung bình luận.");
            return;
        }
        try {
            const response = await axios.post(
                'https://benodejs-9.onrender.com/api/comments',
                { content: commentContent, product_id: parseInt(productId, 10) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                const newComment = {
                    ...response.data.data,
                    customer: { id: user.id, name: user.name },
                    Replies: []
                };
                setComments(prevComments => [newComment, ...prevComments]);
                alert('Gửi bình luận thành công!');
            }
        } catch (error) {
            console.error("Lỗi khi gửi bình luận:", error);
            alert(`Đã xảy ra lỗi khi gửi bình luận: ${error.response?.data?.message || 'Vui lòng thử lại.'}`);
        }
    };

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

    const transformedReviewsList = comments.map(comment => ({
        id: comment.id,
        authorName: comment.customer.name,
        date: new Date(comment.createdAt).toLocaleDateString('vi-VN'),
        rating: 5, 
        comment: comment.content,
        images: [], 
    }));

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
                            isAddingToCart={isCartLoading}
                        />
                    </div>
                </div>

                {product.description && <ProductDescription description={product.description} />}

                <div className="mt-12 lg:mt-16">
                    <ProductReviews
                        averageRating={4.8} 
                        totalReviews={comments.length}
                        reviewsList={transformedReviewsList}
                        onPostComment={handlePostComment} 
                        isAuthenticated={isAuthenticated}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
                    <RelatedProducts products={product.relatedProducts || []} />
                    <RecentlyViewed products={product.recentlyViewed || []} />
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;