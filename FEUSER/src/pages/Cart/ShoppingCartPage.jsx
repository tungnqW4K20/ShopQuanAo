import React, { useState, useEffect, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid'; // Removed unused icons
import QuantitySelector from './QuantitySelector'; // Adjust path if needed

// Helper function
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0đ';
  return value.toLocaleString('vi-VN') + 'đ';
}

// --- Sample Data (Keep existing data) ---
const initialCartItems = [
   { id: 1, productId: 'polo-pique-cotton-01', name: 'Áo Polo Nam Pique Cotton', image: 'https://media3.coolmate.me/cdn-cgi/image/quality=80,format=auto/uploads/December2024/polo-pique-basic-cotton-107-xanh-reu_(5).jpg', color: 'Xanh rêu', size: 'M', quantity: 1, price: 239000, originalPrice: 299000 },
   { id: 2, productId: 'some-other-product', name: 'Quần Jeans Nam Slimfit', image: 'https://media3.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/December2024/quan-jeans-nam-basics-dang-slim-fit-1_48.jpg', color: 'Xanh Đậm', size: '32', quantity: 1, price: 450000, originalPrice: 450000 },
];

const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip2_42.png' },
    { id: 'momo', name: 'Ví MoMo', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip1_171.png' },
    { id: 'zalopay', name: 'Thanh toán qua ZaloPay', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip3_6.png' },
    { id: 'vnpay', name: 'Ví điện tử VNPAY', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip0_81.png', details: 'Quét QR để thanh toán' },
];

const sampleVouchers = [
    { id: 'vc1', code: 'COOL55', discount: 55000, condition: 'Đơn 500k', expiry: '06/05/2025', desc: '[Deal 5.5 Giảm 55k đơn từ 500k (trừ Outlet, Combo tiết kiệm)]' },
    { id: 'vc2', code: 'COOL25', discount: 25000, condition: 'Đơn 150k', expiry: '06/05/2025', desc: '[Deal 5.5 Giảm 25k đơn từ 150k (trừ Outlet, Combo tiết kiệm)]' },
]
// --- End Sample Data ---

// URL for Vietnam administrative data (nested structure)
// Consider hosting this file yourself for production reliability
const VIETNAM_ADDRESS_API_URL = 'https://raw.githubusercontent.com/madnh/hanhchinhvn/master/dist/tree.json';

function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [formData, setFormData] = useState({
    namePrefix: 'Anh/Chị',
    name: '',
    phone: '',
    email: '',
    address: '', // Street address line
    city: '',     // Stores Province Code
    district: '', // Stores District Code
    ward: '',     // Stores Ward Code
    notes: '',
    isGift: false,
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // State for address dropdowns
  const [addressData, setAddressData] = useState(null); // Stores the raw nested data
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [addressError, setAddressError] = useState(null);

  // --- Fetch Address Data ---
  useEffect(() => {
    const fetchAddressData = async () => {
      setIsLoadingAddress(true);
      setAddressError(null);
      try {
        const response = await fetch(VIETNAM_ADDRESS_API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAddressData(data); // Store the full nested data object

        // Populate initial provinces - data is an object keyed by province code
        const provinceOptions = Object.values(data)
            .map(province => ({
                code: province.code,
                name: province.name_with_type // e.g., "Tỉnh Bắc Giang", "Thành phố Hà Nội"
            }))
            .sort((a, b) => a.name.localeCompare(b.name, 'vi')); // Sort Vietnamese correctly
        setProvinces(provinceOptions);

      } catch (error) {
        console.error("Failed to fetch Vietnam address data:", error);
        setAddressError("Không thể tải dữ liệu địa chỉ. Vui lòng làm mới trang hoặc thử lại sau.");
      } finally {
        setIsLoadingAddress(false);
      }
    };

    fetchAddressData();
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Update Districts when Province Changes ---
  useEffect(() => {
    setDistricts([]); // Clear districts first
    setWards([]);     // Clear wards too
    if (formData.city && addressData) {
        const selectedProvinceData = addressData[formData.city]; // Access province by code
        if (selectedProvinceData && selectedProvinceData['quan-huyen']) {
            const districtOptions = Object.values(selectedProvinceData['quan-huyen'])
                .map(district => ({
                    code: district.code,
                    name: district.name_with_type // e.g., "Quận Ba Đình", "Huyện Gia Lâm"
                }))
                .sort((a, b) => a.name.localeCompare(b.name, 'vi')); // Sort Vietnamese
             setDistricts(districtOptions);
        }
        // No need for an else here, already cleared above
    }
  }, [formData.city, addressData]); // Re-run when city or the main data changes

  // --- Update Wards when District Changes ---
   useEffect(() => {
    setWards([]); // Clear wards first
    if (formData.district && formData.city && addressData) {
        const selectedProvinceData = addressData[formData.city];
        const selectedDistrictData = selectedProvinceData?.['quan-huyen']?.[formData.district]; // Access district by code

        if (selectedDistrictData && selectedDistrictData['xa-phuong']) {
            const wardOptions = Object.values(selectedDistrictData['xa-phuong'])
                 .map(ward => ({
                    code: ward.code,
                    name: ward.name_with_type // e.g., "Phường Phúc Xá", "Xã Kim Chung"
                 }))
                 .sort((a, b) => a.name.localeCompare(b.name, 'vi')); // Sort Vietnamese
            setWards(wardOptions);
        }
         // No need for an else here, already cleared above
    }
   }, [formData.district, formData.city, addressData]); // Re-run when district, city or the main data changes


  // --- Form Input Handler (Handles cascading resets) ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => {
        const newState = {
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        };

        // Reset dependent dropdowns when a parent changes
        if (name === 'city') {
          newState.district = '';
          newState.ward = '';
        } else if (name === 'district') {
          newState.ward = '';
        }
        return newState;
    });
  };

  // --- Cart Item Handlers (Keep existing) ---
  const handleQuantityChange = (itemId, newQuantity) => {
    // Prevent quantity going below 1
    const quantity = Math.max(1, newQuantity);
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: quantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    // Optional: Add confirmation dialog here
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  // --- Calculations (Keep existing) ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const total = useMemo(() => {
    const calculatedTotal = subtotal - appliedDiscount + shippingFee;
    return calculatedTotal > 0 ? calculatedTotal : 0; // Prevent negative total
  }, [subtotal, appliedDiscount, shippingFee]);

  // --- Placeholder Handlers (Keep existing) ---
  const handleApplyVoucher = () => {
    // Basic validation (can be improved with conditions)
    const voucher = sampleVouchers.find(v => v.code === voucherCode);
    if (voucher) {
        // TODO: Add actual condition checking (e.g., check subtotal against voucher.condition)
        // Example: if (subtotal >= parseInt(voucher.condition.replace(/\D/g,'')) * 1000) { ... }
        setAppliedDiscount(voucher.discount);
        alert(`Áp dụng voucher ${voucher.code} thành công!`);
    } else {
        setAppliedDiscount(0);
        alert("Mã voucher không hợp lệ hoặc không đủ điều kiện.");
    }
  };

  const handleApplyReferral = () => {
    console.log("Applying referral code:", referralCode);
    alert("Chức năng Mã giới thiệu đang được phát triển.");
     // TODO: Implement referral code logic (likely involves API call)
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Enhanced Form Validation
    const errors = [];
    if (!formData.name.trim()) errors.push("Họ và tên");
    if (!formData.phone.trim()) errors.push("Số điện thoại");
    if (!formData.address.trim()) errors.push("Địa chỉ (Số nhà, tên đường)");
    if (!formData.city) errors.push("Tỉnh/Thành phố");
    if (!formData.district) errors.push("Quận/Huyện");
    if (!formData.ward) errors.push("Phường/Xã");

    if (errors.length > 0) {
        alert(`Vui lòng điền đầy đủ thông tin bắt buộc:\n- ${errors.join("\n- ")}`);
        return;
    }

    if (cartItems.length === 0) {
        alert("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi đặt hàng.");
        return;
    }

    // Optional: Get names for display/sending to backend if needed
    const selectedCityName = provinces.find(p => p.code === formData.city)?.name || '';
    const selectedDistrictName = districts.find(d => d.code === formData.district)?.name || '';
    const selectedWardName = wards.find(w => w.code === formData.ward)?.name || '';

    const orderData = {
      customerInfo: {
          ...formData,
          // Include names if your backend requires them separately from codes
          cityName: selectedCityName,
          districtName: selectedDistrictName,
          wardName: selectedWardName,
      },
      items: cartItems,
      paymentMethod: selectedPayment,
      subtotal: subtotal,
      discount: appliedDiscount,
      shippingFee: shippingFee,
      total: total,
      voucherCode: appliedDiscount > 0 ? voucherCode : '', // Only send voucher if applied
      referralCode: referralCode, // Send referral code if entered
    };

    console.log("Placing Order:", JSON.stringify(orderData, null, 2)); // Pretty print for review
    // TODO: Send orderData to your backend API here
    // Example:
    // fetch('/api/orders', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(orderData)})
    //  .then(response => response.json())
    //  .then(data => { /* Handle success - maybe redirect to thank you page */ })
    //  .catch(error => { /* Handle error */ });

    alert("Đặt hàng thành công! (Đây là mô phỏng)");
    // Optionally clear cart, reset form, redirect, etc.
    // setCartItems([]);
    // setFormData({ /* reset form fields */});
    // setVoucherCode('');
    // setAppliedDiscount(0);
    // history.push('/order-confirmation'); // if using react-router
  };

  // --- Render Logic ---
  if (cartItems.length === 0) {
      return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h1>
              <p className="text-gray-600 mb-6">Hãy quay lại và chọn cho mình sản phẩm ưng ý nhé!</p>
              {/* Consider using Link from react-router-dom if applicable */}
              <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                 Tiếp tục mua sắm
              </a>
          </div>
      )
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">

          {/* Left Column: Form & Payment */}
          <div className="lg:col-span-7 mb-10 lg:mb-0">
            {/* Customer Info Section */}
            <section aria-labelledby="customer-info-heading" className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 id="customer-info-heading" className="text-xl font-semibold text-gray-900 mb-5">Thông tin đặt hàng</h2>
               {/* Loading/Error Indicator for Address */}
               {isLoadingAddress && <p className="text-sm text-blue-600 mb-4 animate-pulse">Đang tải dữ liệu địa chỉ...</p>}
               {addressError && !isLoadingAddress && <p className="text-sm text-red-600 mb-4">{addressError}</p>}

              <form onSubmit={handlePlaceOrder}> {/* Wrap form fields for potential submission handling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                  {/* --- Name --- */}
                  <div className="sm:col-span-2 flex items-end gap-2">
                     <div className="w-1/4">
                         <label htmlFor="namePrefix" className="block text-sm font-medium text-gray-700 mb-1">Danh xưng</label>
                          <select
                             id="namePrefix"
                             name="namePrefix"
                             value={formData.namePrefix}
                             onChange={handleInputChange}
                             className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50"
                          >
                             <option>Anh/Chị</option>
                             <option>Anh</option>
                             <option>Chị</option>
                          </select>
                     </div>
                     <div className="w-3/4">
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                          <input type="text" name="name" id="name" placeholder="Nhập họ tên của bạn" required value={formData.name} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                     </div>
                  </div>

                  {/* --- Phone --- */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" id="phone" placeholder="Nhập số điện thoại của bạn" required value={formData.phone} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                  </div>

                  {/* --- Email --- */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" id="email" placeholder="Theo dõi đơn hàng sẽ được gửi qua Email" value={formData.email} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                  </div>

                  {/* --- Street Address --- */}
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ (Số nhà, tên đường) <span className="text-red-500">*</span></label>
                    <input type="text" name="address" id="address" placeholder="Ví dụ: 103 Vạn Phúc" required value={formData.address} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                  </div>

                  {/* --- City / Province Select --- */}
                  <div>
                     <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                      <select
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                          disabled={isLoadingAddress || provinces.length === 0 || !!addressError}
                      >
                          <option value="">{isLoadingAddress ? 'Đang tải...' : (addressError ? 'Lỗi tải dữ liệu' : 'Chọn Tỉnh/Thành phố')}</option>
                          {!isLoadingAddress && !addressError && provinces.map((province) => (
                              <option key={province.code} value={province.code}>
                                  {province.name}
                              </option>
                          ))}
                      </select>
                  </div>

                  {/* --- District Select --- */}
                   <div>
                     <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
                      <select
                          id="district"
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                          disabled={!formData.city || isLoadingAddress || !!addressError} // Disable if no city or loading/error
                      >
                          <option value="">{ !formData.city ? 'Chọn Tỉnh/Thành phố trước' : (districts.length === 0 ? 'Không có Quận/Huyện' : 'Chọn Quận/Huyện')}</option>
                          {districts.map((district) => (
                               <option key={district.code} value={district.code}>
                                  {district.name}
                              </option>
                          ))}
                      </select>
                  </div>

                   {/* --- Ward Select --- */}
                   <div>
                     <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã <span className="text-red-500">*</span></label>
                      <select
                          id="ward"
                          name="ward"
                          value={formData.ward}
                          onChange={handleInputChange}
                          required
                          className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50 disabled:bg-gray-200 disabled:cursor-not-allowed"
                          disabled={!formData.district || isLoadingAddress || !!addressError} // Disable if no district or loading/error
                      >
                          <option value="">{ !formData.district ? 'Chọn Quận/Huyện trước' : (wards.length === 0 ? 'Không có Phường/Xã' : 'Chọn Phường/Xã') }</option>
                           {wards.map((ward) => (
                               <option key={ward.code} value={ward.code}>
                                  {ward.name}
                              </option>
                          ))}
                      </select>
                  </div>

                   {/* --- Notes --- */}
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea name="notes" id="notes" rows="3" placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)" value={formData.notes} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"></textarea>
                  </div>

                  {/* --- Gift Option --- */}
                   <div className="sm:col-span-2">
                      <label className="flex items-center cursor-pointer">
                          <input
                              type="checkbox"
                              name="isGift"
                              checked={formData.isGift}
                              onChange={handleInputChange}
                              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2 cursor-pointer"
                          />
                           <span className="text-sm text-gray-700 select-none">Gói cho người khác nhận hàng (nếu có)</span>
                      </label>
                   </div>
                </div>
              </form> {/* End Form */}
            </section>

            {/* Payment Method Section */}
            <section aria-labelledby="payment-heading" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 id="payment-heading" className="text-xl font-semibold text-gray-900 mb-5">Hình thức thanh toán</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    htmlFor={`payment-${method.id}`} // Add htmlFor for accessibility
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors duration-150 ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`payment-${method.id}`} // Add id for label association
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1 mr-3 cursor-pointer"
                    />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {method.icon && <img src={method.icon} alt="" className="h-6 mr-2 object-contain"/>} {/* Added alt="" */}
                                <span className="text-sm font-medium text-gray-800">{method.name}</span>
                            </div>
                            {/* Placeholder for potential bank icons */}
                            {/* {method.banks && ( ... )} */}
                        </div>
                       {method.details && <p className="text-xs text-gray-500 mt-1">{method.details}</p>}
                    </div>
                  </label>
                ))}
              </div>
               <p className="text-xs text-gray-500 mt-6">Nếu bạn không hài lòng với sản phẩm của chúng tôi? Coolmate hoàn tiền hoặc đổi hàng miễn phí. Tìm hiểu thêm <a href="#" className="text-blue-600 hover:underline font-medium">tại đây</a>.</p> {/* Improved text */}
            </section>

          </div> {/* End Left Column */}


          {/* Right Column: Cart & Summary */}
          <div className="lg:col-span-5">
             {/* Cart Items Section */}
             <section aria-labelledby="cart-heading" className="bg-white p-6 rounded-lg shadow-sm mb-6">
                 <h2 id="cart-heading" className="text-xl font-semibold text-gray-900 mb-5">Giỏ hàng ({cartItems.reduce((count, item) => count + item.quantity, 0)} sản phẩm)</h2>
                 {/* Promotion Banner Example (Dynamic condition) */}
                 {subtotal < 269000 && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-md mb-5 flex items-center justify-between gap-2">
                        <span>🎁 Mua thêm <span className='font-bold'>{formatPrice(269000 - subtotal)}</span> để nhận quà <span className='font-bold'>trị giá 249k</span></span>
                        <a href="/" className="flex-shrink-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-700 transition-colors">Mua ngay</a>
                    </div>
                 )}

                 {/* Cart Item List */}
                 <ul role="list" className="divide-y divide-gray-200">
                     {cartItems.map((item) => (
                         <li key={item.id} className="flex py-4 sm:py-5 gap-4">
                             <div className="flex-shrink-0">
                                 {/* Consider adding Link to product page */}
                                 <a href={`#product/${item.productId}`}>
                                    <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border border-gray-200 hover:opacity-90 transition-opacity" />
                                 </a>
                             </div>
                             <div className="flex-1 flex flex-col justify-between">
                                 <div>
                                     <div className="flex justify-between items-start gap-2">
                                         <h3 className="text-sm font-medium text-gray-800 hover:text-indigo-600 leading-tight">
                                             {/* Consider adding Link to product page */}
                                             <a href={`#product/${item.productId}`}>{item.name}</a>
                                         </h3>
                                         <p className="ml-2 flex-shrink-0 text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                     </div>
                                     <p className="mt-1 text-xs text-gray-500">
                                         {item.color} / {item.size}
                                         {item.originalPrice > item.price && (
                                            <span className="ml-2 line-through text-gray-400">{formatPrice(item.originalPrice)}</span>
                                         )}
                                     </p>
                                 </div>
                                 <div className="mt-2 flex items-center justify-between">
                                     <QuantitySelector
                                        quantity={item.quantity}
                                        onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                                     />
                                     <button
                                        type="button"
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="ml-4 text-xs font-medium text-red-600 hover:text-red-500 flex items-center transition-colors"
                                        title="Xóa sản phẩm"
                                     >
                                         <TrashIcon className="h-4 w-4 mr-1" aria-hidden="true" /> Xóa
                                     </button>
                                 </div>
                             </div>
                         </li>
                     ))}
                 </ul>
             </section>

             {/* Available Vouchers Section */}
             <section className="mb-6">
                 <p className="text-sm text-gray-600 mb-3">Có {sampleVouchers.length} mã giảm giá có thể sử dụng:</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {sampleVouchers.map(vc => (
                         <div key={vc.id} className="bg-white border border-dashed border-blue-300 p-3 rounded-lg shadow-sm flex flex-col justify-between text-xs relative overflow-hidden">
                             {/* Decorative corner */}
                              <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                             <div className="pl-2">
                                <p className="font-semibold text-blue-700">{vc.code}</p>
                                <p className="text-gray-600 mt-1">{vc.desc}</p>
                                <p className="text-gray-400 mt-1">HSD: {vc.expiry}</p>
                             </div>
                              <button
                                onClick={() => { setVoucherCode(vc.code); handleApplyVoucher(); }} // Apply immediately on click
                                className="text-blue-600 hover:text-blue-800 mt-2 text-left font-medium text-sm transition-colors"
                              >
                                Áp dụng ngay
                              </button>
                         </div>
                     ))}
                 </div>
             </section>

             {/* Apply Codes Section */}
             <section className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
                 {/* Voucher Input */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Nhập mã giảm giá khác"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50"
                        aria-label="Mã giảm giá"
                    />
                    <button
                        type="button"
                        onClick={handleApplyVoucher}
                        disabled={!voucherCode.trim()}
                        className="px-5 py-2.5 border border-transparent rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       Áp dụng
                    </button>
                </div>
                 {/* Referral Input */}
                 <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Mã giới thiệu (Nếu có)"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50"
                        aria-label="Mã giới thiệu"
                    />
                    <button
                        type="button"
                        onClick={handleApplyReferral}
                        disabled={!referralCode.trim()}
                        className="px-5 py-2.5 border border-blue-600 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                       Áp dụng
                    </button>
                </div>
             </section>

             {/* Order Summary Section */}
             <section aria-labelledby="summary-heading" className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                <h2 id="summary-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Tổng cộng</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                     {appliedDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá Voucher ({voucherCode})</span>
                            <span>-{formatPrice(appliedDiscount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Phí giao hàng</span>
                        {/* TODO: Calculate dynamic shipping based on address/subtotal */}
                        <span className="font-medium text-gray-900">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-semibold">
                        <span>Tổng cộng</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                     {/* Display total original price savings */}
                     {/* {totalOriginalPrice > subtotal && (
                       <p className="text-xs text-right text-gray-500">(Tiết kiệm {formatPrice(totalOriginalPrice - subtotal)} so với giá gốc)</p>
                     )} */}
                     <p className="text-xs text-right text-gray-500">(Đã bao gồm VAT nếu có)</p>
                </div>

                 {/* CoolCash Info */}
                <p className="text-xs text-blue-600 mt-4 text-center bg-blue-50 p-2 rounded">
                    Đăng nhập/Đăng ký để hoàn <span className='font-bold'>{formatPrice(Math.floor(subtotal * 0.03))} CoolCash</span> vào ví
                </p>

                {/* Place Order Button */}
                <div className="mt-6">
                    <button
                        type="button" // Use type="submit" if the form wrapper should handle submission
                        onClick={handlePlaceOrder} // Or let the form's onSubmit handle it
                        className="w-full bg-gray-900 text-white py-3 px-4 rounded-md shadow-sm text-base font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-60 disabled:cursor-wait transition-all"
                        disabled={isLoadingAddress || !formData.name || !formData.phone || !formData.address || !formData.city || !formData.district || !formData.ward } // Basic check for required fields + address loading
                    >
                       {isLoadingAddress ? 'Đang tải địa chỉ...' : 'Tiến hành đặt hàng'}
                    </button>
                </div>
             </section>
          </div> {/* End Right Column */}

        </div> {/* End Main Grid */}
      </div> {/* End Container */}
    </div> // End Page Wrapper
  );
}

export default ShoppingCartPage;