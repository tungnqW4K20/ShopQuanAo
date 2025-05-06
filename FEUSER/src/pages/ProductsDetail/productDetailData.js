// src/productDetailData.js

export const product = {
    id: 'polo-pique-cotton-01',
    name: 'Áo Polo Nam Pique Cotton',
    subTitle: '100% Cotton',
    breadcrumbs: [
      { name: 'Trang chủ', href: '#' },
      { name: 'Đồ Nam', href: '#' },
      { name: 'Áo Polo Nam', href: '#' }, // Current page - not a link
    ],
    images: [
      { id: 1, src: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(7).png', alt: 'Áo Polo Nâu - Chính' },
      { id: 2, src: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(1).jpg', alt: 'Áo Polo Nâu - Thumb 1' },
      { id: 3, src: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(4).jpg', alt: 'Áo Polo Nâu - Thumb 2' },
      { id: 4, src: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(3).jpg', alt: 'Áo Polo Nâu - Thumb 3' },
      { id: 5, src: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(5).jpg', alt: 'Áo Polo Nâu - Thumb 4' },
      { id: 6, src: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(6).jpg', alt: 'Áo Polo Nâu - Thumb 5' },
      // Add images for other colors if needed, or handle dynamically
    ],
    rating: 4.8,
    reviewCount: 274,
    price: 239000,
    originalPrice: 299000,
    freeship: true,
    vouchers: ['Giảm 555k', 'Giảm 255k', 'Giảm 55k'],
    colors: [
      { name: 'Nâu đậm', hex: '#8B4513', image: '/images/polo-brown-thumb1.jpg' }, // Brown
      { name: 'Xanh Navy', hex: '#000080', image: '/images/polo-navy-thumb.jpg' }, // Navy
      { name: 'Đen', hex: '#000000', image: '/images/polo-black-thumb.jpg' }, // Black
      { name: 'Trắng', hex: '#FFFFFF', image: '/images/polo-white-thumb.jpg' }, // White
      { name: 'Xanh rêu', hex: '#8FBC8F', image: '/images/polo-moss-thumb.jpg' }, // Moss Green
      { name: 'Be', hex: '#F5F5DC', image: '/images/polo-beige-thumb.jpg' }, // Beige
      { name: 'Xám', hex: '#808080', image: '/images/polo-grey-thumb.jpg' }, // Grey
      { name: 'Xanh nhạt', hex: '#ADD8E6', image: '/images/polo-lightblue-thumb.jpg' }, // Light Blue stripe?
      { name: 'Đỏ đô', hex: '#800000', image: '/images/polo-maroon-thumb.jpg' }, // Maroon
      { name: 'Xanh lá nhạt', hex: '#90EE90', image: '/images/polo-lightgreen-thumb.jpg' }, // Light green stripe?
    ],
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'],
    policies: [
      { icon: 'box', text: 'Được hoàn tiền đến 17.000 CoolCash.', detailsLink: '#' },
      { icon: 'chat', text: 'Chat để được Coolmate tư vấn ngay (8:30 - 22:00)', link: '#' },
    ],
    detailedPolicies: [
      { icon: 'https://www.coolmate.me/images/product-detail/return.svg', text: 'Đổi trả cực dễ chỉ cần số điện thoại' },
      { icon: 'https://www.coolmate.me/images/product-detail/return-60.svg', text: '60 ngày đổi trả vì bất kỳ lý do gì' },
      { icon: 'https://www.coolmate.me/images/product-detail/phone.svg', text: 'Hotline 1900.27.27.57 hỗ trợ từ 8h30 - 22h mối ngày' },
      { icon: 'https://www.coolmate.me/images/product-detail/location.svg', text: 'Đến tận nơi nhận hàng trả, hoàn tiền trong 24h' },
    ],
    description: {
      features: [
         { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip6_26.png', title: 'Co giãn' },
         { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip17_68.png', title: 'Thoáng mát' },
         { icon: 'https://mcdn.coolmate.me/image/January2024/mceclip15_84.png', title: 'Thấm hút' },
      ],
      specs: [
          { label: 'CHẤT LIỆU', value: '100% Cotton' },
          { label: 'KIỂU DÁNG', value: 'Regular fit' },
          { label: 'NGƯỜI MẪU', value: 'cao 1m86 - 77kg, mặc size 2XL' },
          { label: 'PHÙ HỢP', value: 'Đi làm, đi chơi hoặc mặc hàng ngày' },
          { label: 'TÍNH NĂNG', value: 'Kiểu dệt Pique giúp áo thoáng mát\nXử lý hoàn thiện giúp ít xù lông' },
      ],
      proudlyMadeIn: 'Proudly Made In Vietnam',
      sections: [ // Example structure for description content
          { type: 'image', src: 'https://mcdn.coolmate.me//image/March2025/ao-polo-nam-pique-cotton-thumb-1.png', alt: 'Polo description image 1'},
          { type: 'heading', text: 'Đặc điểm nổi bật Áo polo nam Pique Cotton'},
          { type: 'subheading', text: '1. Chất liệu Cotton cao cấp'},
          { type: 'paragraph', text: 'Áo polo nam chất liệu pique cotton 100% cao cấp, mềm mại và thoáng khí tối ưu, đảm bảo mang lại trải nghiệm mặc thoải mái nhất cho các chàng suốt cả ngày dài.'},
          { type: 'link', text: 'Tìm hiểu thêm về cotton tại đây? Những điều bạn cần biết về vải Cotton', href:'#'},
          { type: 'image', src: 'https://mcdn.coolmate.me/image/August2023/mceclip0_66.jpg', alt: 'Polo description image 2 - Ready to wear'},
          { type: 'heading', text: 'CHẤT LIỆU COTTON'},
          // ... more description sections
      ],
      stylingTips: {
          title: 'Cách phối đồ Áo polo nam Pique Cotton',
          items: [
              'Áo polo pique cotton + Quần tây Âu/Quần kaki + Giày tây/Giày lười',
              // ... other tips
          ]
      }
    },
    relatedProducts: [ /* Array of product IDs or simplified product objects from data.js */ ],
    reviews: { /* Review data structure */ },
    recentlyViewed: [ /* Array of product IDs or simplified product objects from data.js */ ],
    offerBannerImage: '/images/offer-banner-polo.jpg'
  };