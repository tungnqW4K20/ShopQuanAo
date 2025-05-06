export const categories = [
    { id: 'jean', name: 'Quần Jean' },
    { id: 'thun', name: 'Áo Thun' },
    { id: 'jogger', name: 'Quần Jogger' },
    { id: 'kaki', name: 'Quần Kaki' },
    { id: 'pants', name: 'Quần Pants' },
    { id: 'shorts', name: 'Quần Shorts' },
    { id: 'dai_tay', name: 'Áo dài tay' },
    { id: 'polo', name: 'Áo Polo' },
    { id: 'lot', name: 'Quần Lót' },
    { id: 'khoac', name: 'Áo Khoác' },
    { id: 'dai', name: 'Quần Dài' },
    { id: 'so_mi', name: 'Áo Sơ Mi' },
    { id: 'tanktop', name: 'Áo Tanktop' },
    { id: 'the_thao', name: 'Áo thể thao' },
  ];
  
  export const sizes = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '29', '30', '31', '32', '33'];
  
  export const colors = [
    { name: 'Phối màu', hex: 'multi', style: 'bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500' },
    { name: 'Đen', hex: '#000000', style: 'bg-black' },
    { name: 'Xám', hex: '#808080', style: 'bg-gray-500' },
    { name: 'Trắng', hex: '#FFFFFF', style: 'bg-white border border-gray-300' },
    { name: 'Be', hex: '#F5F5DC', style: 'bg-beige' }, // Assuming you have a beige color in tailwind.config.js or use a close one like bg-yellow-100
    { name: 'Xanh lam', hex: '#0000FF', style: 'bg-blue-600' },
    { name: 'Xanh lá', hex: '#008000', style: 'bg-green-600' },
    { name: 'Xanh ngọc', hex: '#40E0D0', style: 'bg-teal-400' },
    { name: 'Đỏ', hex: '#FF0000', style: 'bg-red-600' },
    { name: 'Cam', hex: '#FFA500', style: 'bg-orange-500' },
    { name: 'Vàng', hex: '#FFFF00', style: 'bg-yellow-400' },
    { name: 'Tím', hex: '#800080', style: 'bg-purple-600' },
    { name: 'Nâu', hex: '#A52A2A', style: 'bg-amber-800' }, // Use amber or brown
    { name: 'Hồng', hex: '#FFC0CB', style: 'bg-pink-400' },
    { name: 'Xanh sáng', hex: '#ADD8E6', style: 'bg-sky-400' }, // Use sky or light blue
    { name: 'Xanh đậm', hex: '#00008B', style: 'bg-indigo-800' }, // Use indigo or dark blue
    { name: 'Đen xám', hex: '#36454F', style: 'bg-gray-800' },
  ];
  
  export const products = [
   
    {
      id: 1,
      name: 'Áo Thun Nam Thể Thao Coolmate Basics',
      imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/August2024/Ao_Thun_Nam_The_Thao_Coolmate_Basics_-_Den_6_(2).jpg', 
      rating: 4.9,
      reviews: 855,
      price: 159000, 
      originalPrice: 219000, 
      colors: ['#000000', '#D2B48C', '#808080', '#FFFFFF', '#0000FF'], 
      availableColorCount: 5,
      badge: 'ĐANG MUA', 
      voucher: 'VOUCHER 555K',
    },
    {
      id: 2,
      name: 'Áo Thun Nam Cotton 220GSM',
      imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/January2024/AT.220.xd.10.jpg',
      rating: 4.8,
      reviews: 231,
      price: 249000,
      originalPrice: 299000,
      colors: ['#D2B48C', '#000000', '#FFFFFF', '#0000FF', '#008000'],
      availableColorCount: 8,
      badge: 'TẶNG QUÀ',
      offerText: 'TẶNG 01 SET QUẦN SHORTS ĐƠN TỪ 500K',
    },
    {
      id: 3,
      name: 'Quần Shorts Summer Cool 7 inch',
      imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/June2024/24CMAW.BS002.26_28.jpg',
      rating: 4.9,
      reviews: 34,
      price: 299000,
      originalPrice: 349000,
      colors: ['#0000FF', '#000000', '#808080'],
      availableColorCount: 3,
      badge: 'ĐANG MUA',
      voucher: 'VOUCHER 555K',
    },
     {
      id: 4,
      name: 'Quần Shorts Thể thao 7 inch đa năng',
      imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/August2024/den_2(1).jpg',
      rating: 4.8,
      reviews: 77,
      price: 279000,
      originalPrice: 329000,
      colors: ['#000000', '#36454F', '#0000FF', '#808080'],
      availableColorCount: 4,
      badge: 'ĐANG MUA',
      voucher: 'VOUCHER 555K',
    },

    {
        id: 5,
        name: 'Quần Jean Nam Slim Fit',
        imageUrl: 'https://product.hstatic.net/200000325151/product/xucqn-jean-slim-fit-4_472c3f0ac7ea4248b4e9892783114695.png', // Use placeholders
        rating: 4.7,
        reviews: 150,
        price: 450000,
        originalPrice: 550000,
        colors: ['#00008B', '#36454F'], // Dark blue, Dark grey
        availableColorCount: 2,
        badge: 'GIẢM GIÁ',
        voucher: 'VOUCHER 100K',
        categoryId: 'jean',
        availableSizes: ['29', '30', '31', '32', '33'],
      },
        {
        id: 6,
        name: 'Áo Polo Nam Pique Cotton',
        imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/December2024/polo-pique-basic-cotton-103-nau-dam_(1).jpg', // Use placeholders
        rating: 4.9,
        reviews: 300,
        price: 320000,
        originalPrice: 399000,
        colors: ['#FFFFFF', '#000000', '#0000FF', '#A52A2A'], // White, Black, Blue, Brown
        availableColorCount: 4,
        badge: 'BÁN CHẠY',
        categoryId: 'polo',
        availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
      },
      {
        id: 7,
        name: 'Quần Jogger Nỉ Nam',
        imageUrl: 'https://zizoou.com/cdn/shop/products/Quan-jogger-1b-Grey-3-ZiZoou-Store.jpg?v=1646581637', // Use placeholders
        rating: 4.6,
        reviews: 95,
        price: 280000,
        originalPrice: null, // No discount
        colors: ['#808080', '#000000'], // Grey, Black
        availableColorCount: 2,
        categoryId: 'jogger',
        availableSizes: ['M', 'L', 'XL'],
      },
      {
        id: 8,
        name: 'Áo Thun Dài Tay Basic',
        imageUrl: 'https://product.hstatic.net/200000690725/product/53981825813_589021cdf1_c_3593b5f3d0af4cc4aa3bada32afdae06_master.jpg', // Use placeholders
        rating: 4.8,
        reviews: 110,
        price: 199000,
        originalPrice: 249000,
        colors: ['#FFFFFF', '#000000', '#808080'], // White, Black, Grey
        availableColorCount: 3,
        categoryId: 'dai_tay',
        availableSizes: ['S', 'M', 'L', 'XL', '2XL'],
      },
      {
        id: 9,
        name: 'Quần Lót Nam Trunk Cool',
        imageUrl: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85/uploads/May2023/trunkcafelot-cao-5_9.jpg', // Use placeholders
        rating: 4.9,
        reviews: 500,
        price: 150000, // Price for a pack maybe?
        originalPrice: 190000,
        colors: ['#000000', '#36454F', '#00008B'], // Black, Dark Grey, Dark Blue
        availableColorCount: 3,
        badge: 'COMBO 3',
        categoryId: 'lot',
        availableSizes: ['M', 'L', 'XL', '2XL'],
      },
       {
        id: 10,
        name: 'Áo Khoác Gió Mỏng Nhẹ',
        imageUrl: 'https://aokhoacnam.vn/upload/product/akn-005/thumb/ao-gio-chong-nang-mong-xanh_x450.jpg', // Use placeholders
        rating: 4.7,
        reviews: 65,
        price: 350000,
        originalPrice: 420000,
        colors: ['#000000', '#00008B'], // Black, Dark Blue
        availableColorCount: 2,
        categoryId: 'khoac',
        availableSizes: ['L', 'XL', '2XL', '3XL'],
      },
       {
        id: 11,
        name: 'Quần Kaki Nam Regular',
        imageUrl: 'data:image/jpeg;base64,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', // Use placeholders
        rating: 4.6,
        reviews: 120,
        price: 380000,
        originalPrice: null,
        colors: ['#F5F5DC', '#A52A2A'], // Beige, Brown
        availableColorCount: 2,
        categoryId: 'kaki',
        availableSizes: ['30', '31', '32', '33', '4XL'], // Added 4XL for example
      },
      {
        id: 12,
        name: 'Áo Sơ Mi Nam Oxford',
        imageUrl: 'https://down-vn.img.susercontent.com/file/7b89285ed159f758ba1fd08ecef76009', // Use placeholders
        rating: 4.8,
        reviews: 210,
        price: 399000,
        originalPrice: 450000,
        colors: ['#FFFFFF', '#ADD8E6'], // White, Light Blue
        availableColorCount: 2,
        badge: 'NEW',
        categoryId: 'so_mi',
        availableSizes: ['S', 'M', 'L', 'XL'],
      },

  ];
  
  export const findColorClass = (hex) => {
      const color = colors.find(c => c.hex === hex);
     
      if (color) {
          const match = color.style.match(/bg-([a-z]+)-?(\d+)?/);
          if (match) {
             return `bg-${match[1]}${match[2] ? `-${match[2]}` : '-500'}`; 
          }
          if(color.style.includes('bg-black')) return 'bg-black';
          if(color.style.includes('bg-white')) return 'bg-white border border-gray-300';
      }
      return 'bg-gray-300';
  }