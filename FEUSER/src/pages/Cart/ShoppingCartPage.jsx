import React, { useState, useEffect, useMemo } from 'react';
import { TrashIcon, ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid';
import QuantitySelector from './QuantitySelector'; // Adjust path if needed

// Helper function
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0đ';
  return value.toLocaleString('vi-VN') + 'đ';
}

// --- Sample Data (Replace with actual state/props) ---
const initialCartItems = [
   { id: 1, productId: 'polo-pique-cotton-01', name: 'Áo Polo Nam Pique Cotton', image: '/images/polo-green-thumb.jpg', color: 'Xanh rêu', size: 'M', quantity: 1, price: 239000, originalPrice: 299000 },
   { id: 2, productId: 'some-other-product', name: 'Quần Jeans Nam Slimfit', image: '/images/jeans-thumb.jpg', color: 'Xanh Đậm', size: '32', quantity: 1, price: 450000, originalPrice: 450000 },
];

const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng', icon: '/images/icon-cod.svg' }, // Replace with actual icon path
    { id: 'momo', name: 'Ví MoMo', icon: '/images/icon-momo.svg' },
    { id: 'zalopay', name: 'Thanh toán qua ZaloPay', icon: '/images/icon-zalopay.svg', details: 'Hỗ trợ mọi hình thức thanh toán', banks: ['napas', 'visa', 'mastercard', 'jcb', 'gpay'] },
    { id: 'vnpay', name: 'Ví điện tử VNPAY', icon: '/images/icon-vnpay.svg', details: 'Quét QR để thanh toán' },
];

const sampleVouchers = [
    { id: 'vc1', code: 'COOL55', discount: 55000, condition: 'Đơn 500k', expiry: '06/05/2025', desc: '[Deal 5.5 Giảm 55k đơn từ 500k (trừ Outlet, Combo tiết kiệm)]' },
    { id: 'vc2', code: 'COOL25', discount: 25000, condition: 'Đơn 150k', expiry: '06/05/2025', desc: '[Deal 5.5 Giảm 25k đơn từ 150k (trừ Outlet, Combo tiết kiệm)]' },
]
// --- End Sample Data ---


function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [formData, setFormData] = useState({
    namePrefix: 'Anh/Chị',
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: '',
    isGift: false,
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0); // Example discount state
  const [shippingFee, setShippingFee] = useState(0); // Example shipping (0 = free)

  // --- Form Input Handler ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // --- Cart Item Handlers ---
  const handleQuantityChange = (itemId, newQuantity) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    // Add confirmation if desired
  };

  // --- Calculations ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const total = useMemo(() => {
    const calculatedTotal = subtotal - appliedDiscount + shippingFee;
    return calculatedTotal > 0 ? calculatedTotal : 0; // Prevent negative total
  }, [subtotal, appliedDiscount, shippingFee]);

  // --- Placeholder Handlers ---
  const handleApplyVoucher = () => {
    // TODO: Implement actual voucher validation and application logic
    console.log("Applying voucher:", voucherCode);
    if (voucherCode === 'COOL55') {
        setAppliedDiscount(55000); // Example
        alert("Áp dụng voucher thành công!");
    } else if (voucherCode === 'COOL25') {
        setAppliedDiscount(25000);
         alert("Áp dụng voucher thành công!");
    }
    else {
        setAppliedDiscount(0);
        alert("Mã voucher không hợp lệ hoặc không đủ điều kiện.");
    }
  };

  const handleApplyReferral = () => {
    // TODO: Implement referral code logic
    console.log("Applying referral code:", referralCode);
    alert("Chức năng Mã giới thiệu đang được phát triển.");
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault(); // Prevent default form submission if wrapped in <form>
    // TODO: Add form validation here
    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.district || !formData.ward) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng bắt buộc.");
        return;
    }
    if(cartItems.length === 0){
        alert("Giỏ hàng của bạn đang trống.");
        return;
    }

    const orderData = {
      customerInfo: formData,
      items: cartItems,
      paymentMethod: selectedPayment,
      subtotal: subtotal,
      discount: appliedDiscount,
      shippingFee: shippingFee,
      total: total,
      voucherCode: voucherCode, // Include applied voucher if needed
      referralCode: referralCode,
    };
    console.log("Placing Order:", orderData);
    // TODO: Send orderData to backend API
    alert("Đặt hàng thành công! (Mô phỏng)");
    // Optionally clear cart, redirect, etc.
  };

  // --- Render Logic ---
  if (cartItems.length === 0) {
      return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h1>
              <p className="text-gray-600 mb-6">Hãy quay lại và chọn cho mình sản phẩm ưng ý nhé!</p>
              <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
                {/* Name */}
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

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" id="phone" placeholder="Nhập số điện thoại của bạn" required value={formData.phone} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" name="email" id="email" placeholder="Theo dõi đơn hàng sẽ được gửi qua Email" value={formData.email} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                </div>

                {/* Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                  <input type="text" name="address" id="address" placeholder="Địa chỉ (Ví dụ: 103 Vạn Phúc, phường Vạn Phúc)" required value={formData.address} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                </div>

                {/* City / District / Ward Selects (Placeholder) */}
                <div>
                   <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố <span className="text-red-500">*</span></label>
                    <select id="city" name="city" value={formData.city} onChange={handleInputChange} required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50">
                        <option value="">Chọn Tỉnh/Thành phố</option>
                        <option value="HCM">Hồ Chí Minh</option>
                        <option value="HN">Hà Nội</option>
                        {/* TODO: Add more options or fetch dynamically */}
                    </select>
                </div>
                 <div>
                   <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện <span className="text-red-500">*</span></label>
                    <select id="district" name="district" value={formData.district} onChange={handleInputChange} required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50" disabled={!formData.city}>
                        <option value="">Chọn Quận/Huyện</option>
                        {/* TODO: Populate based on city */}
                         {formData.city === 'HCM' && <option value="Q1">Quận 1</option>}
                         {formData.city === 'HCM' && <option value="QTB">Quận Tân Bình</option>}
                         {formData.city === 'HN' && <option value="HK">Quận Hoàn Kiếm</option>}
                    </select>
                </div>
                 <div>
                   <label htmlFor="ward" className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã <span className="text-red-500">*</span></label>
                    <select id="ward" name="ward" value={formData.ward} onChange={handleInputChange} required className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50" disabled={!formData.district}>
                        <option value="">Chọn Phường/Xã</option>
                         {/* TODO: Populate based on district */}
                         {formData.district === 'Q1' && <option value="PBN">Phường Bến Nghé</option>}
                         {formData.district === 'QTB' && <option value="P2">Phường 2</option>}
                         {formData.district === 'HK' && <option value="HTT">Phường Hàng Trống</option>}
                    </select>
                </div>

                 {/* Notes */}
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea name="notes" id="notes" rows="3" placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)" value={formData.notes} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"></textarea>
                </div>

                {/* Gift Option */}
                 <div className="sm:col-span-2">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="isGift"
                            checked={formData.isGift}
                            onChange={handleInputChange}
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 mr-2"
                        />
                         <span className="text-sm text-gray-700">Gói cho người khác nhận hàng(nếu có)</span>
                    </label>
                 </div>
              </div>
            </section>

            {/* Payment Method Section */}
            <section aria-labelledby="payment-heading" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 id="payment-heading" className="text-xl font-semibold text-gray-900 mb-5">Hình thức thanh toán</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors duration-150 ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1 mr-3"
                    />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={method.icon} alt={method.name} className="h-6 mr-2"/>
                                <span className="text-sm font-medium text-gray-800">{method.name}</span>
                            </div>
                            {method.banks && (
                                <div className="flex items-center space-x-1">
                                    {method.banks.map(bank => (
                                        <img key={bank} src={`/images/icon-${bank}.svg`} alt={bank} className="h-4" />
                                    ))}
                                </div>
                            )}
                        </div>
                       {method.details && <p className="text-xs text-gray-500 mt-1">{method.details}</p>}
                    </div>
                  </label>
                ))}
              </div>
               <p className="text-xs text-gray-500 mt-6">Nếu bạn không hài lòng với sản phẩm của chúng tôi? Coolmate tin cập án hoàn tiền có thể tìm thấy thêm tìm hiểu <a href="#" className="text-blue-600 hover:underline">tại đây</a>.</p>
            </section>

          </div> {/* End Left Column */}


          {/* Right Column: Cart & Summary */}
          <div className="lg:col-span-5">
             {/* Cart Items Section */}
             <section aria-labelledby="cart-heading" className="bg-white p-6 rounded-lg shadow-sm mb-6">
                 <h2 id="cart-heading" className="text-xl font-semibold text-gray-900 mb-5">Giỏ hàng</h2>
                 {/* Promotion Banner */}
                 <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-md mb-5 flex items-center justify-between">
                     <span>🎁 Mua thêm đồ <span className='font-bold'>{formatPrice(269000 - subtotal > 0 ? 269000 - subtotal : 0)}</span> để nhận <span className='font-bold'>áo thun + shorts</span> trị giá 249k</span>
                     <button className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-700">Mua ngay</button>
                 </div>

                  {/* Cart Header (Optional) */}
                 {/* <div className="hidden sm:grid grid-cols-6 gap-4 text-xs font-medium text-gray-500 uppercase mb-3 pb-2 border-b">
                     <span className="col-span-3">Sản phẩm</span>
                     <span className="text-center">Số lượng</span>
                     <span className="text-right">Giá</span>
                     <span></span>
                 </div> */}

                 {/* Cart Item List */}
                 <ul role="list" className="divide-y divide-gray-200">
                     {cartItems.map((item) => (
                         <li key={item.id} className="flex py-4 sm:py-5">
                             <div className="flex-shrink-0">
                                 <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border border-gray-200" />
                             </div>
                             <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-5">
                                 <div>
                                     <div className="flex justify-between items-start">
                                         <h3 className="text-sm font-medium text-gray-800 hover:text-indigo-600">
                                             <a href="#">{item.name}</a> {/* Add product link later */}
                                         </h3>
                                         <p className="ml-4 text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                     </div>
                                     <p className="mt-1 text-xs text-gray-500">
                                         {item.color} / {item.size}
                                         {item.originalPrice > item.price && <span className="ml-2 line-through">{formatPrice(item.originalPrice)}</span>}
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
                                        className="ml-4 text-xs font-medium text-red-600 hover:text-red-500 flex items-center"
                                     >
                                         <TrashIcon className="h-4 w-4 mr-1" /> Xóa
                                     </button>
                                 </div>
                             </div>
                         </li>
                     ))}
                 </ul>
             </section>

             {/* Available Vouchers Section */}
             <section className="mb-6">
                 <p className="text-sm text-gray-600 mb-3">Có {sampleVouchers.length} mã gợi ý đang chờ bạn áp dụng vào giỏ hàng:</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {sampleVouchers.map(vc => (
                         <div key={vc.id} className="bg-white border border-dashed border-gray-300 p-3 rounded-lg shadow-sm flex flex-col justify-between text-xs">
                             <div>
                                <p className="font-semibold text-gray-800">{vc.code} <span className="text-gray-500 font-normal">(Còn {vc.condition})</span></p>
                                <p className="text-gray-600 mt-1">{vc.desc}</p>
                                <p className="text-gray-400 mt-1">HSD: {vc.expiry}</p>
                             </div>
                             <button onClick={() => setVoucherCode(vc.code)} className="text-blue-600 hover:underline mt-2 text-left font-medium">Điều kiện</button>
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
                        placeholder="Nhập mã giảm giá"
                        value={voucherCode}
                        onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                        className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50"
                    />
                    <button
                        onClick={handleApplyVoucher}
                        disabled={!voucherCode}
                        className="px-5 py-2.5 border border-gray-300 rounded-md text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Áp dụng Voucher
                    </button>
                </div>
                 {/* Referral Input */}
                 <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Mã giới thiệu bạn bè"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value)}
                        className="flex-grow border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5 bg-gray-50"
                    />
                    <button
                        onClick={handleApplyReferral}
                        disabled={!referralCode}
                        className="px-5 py-2.5 border border-blue-600 rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       Nhập mã
                    </button>
                </div>
             </section>

             {/* Order Summary Section */}
             <section aria-labelledby="summary-heading" className="bg-white p-6 rounded-lg shadow-sm sticky top-4"> {/* Sticky summary */}
                <h2 id="summary-heading" className="sr-only">Order summary</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính</span>
                        <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
                    </div>
                     {appliedDiscount > 0 && (
                        <div className="flex justify-between text-green-600">
                            <span>Giảm giá Voucher</span>
                            <span>-{formatPrice(appliedDiscount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-gray-600">Phí giao hàng</span>
                        <span className="font-medium text-gray-900">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-semibold">
                        <span>Tổng</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                     {subtotal > appliedDiscount && ( // Show discount only if total > 0 after discount
                       <p className="text-xs text-right text-gray-500">(Đã giảm {formatPrice(subtotal - total + shippingFee)} trên giá gốc)</p>
                     )}
                </div>

                 {/* CoolCash Info */}
                <p className="text-xs text-blue-600 mt-4 text-center">
                    Đăng nhập để hoàn <span className='font-bold'>{formatPrice(Math.floor(subtotal * 0.03))} CoolCash</span> | Tiết kiệm {formatPrice(69000)}
                </p>

                {/* Place Order Button */}
                <div className="mt-6">
                    <button
                        type="button" // Change to type="submit" if inside a <form> element
                        onClick={handlePlaceOrder}
                        className="w-full bg-gray-900 text-white py-3 px-4 rounded-md shadow-sm text-base font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                    >
                       Đặt hàng
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