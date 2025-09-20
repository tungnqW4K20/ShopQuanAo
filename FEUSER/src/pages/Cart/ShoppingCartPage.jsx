import React, { useState, useEffect, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import QuantitySelector from './QuantitySelector';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';
const formatPrice = (value) => {
  if (value === null || value === undefined) return '0đ';
  return Number(value).toLocaleString('vi-VN') + 'đ';
}

const paymentMethods = [
    { id: 'cod', name: 'Thanh toán khi nhận hàng', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip2_42.png' },
    { id: 'momo', name: 'Ví MoMo', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip1_171.png' },
    { id: 'zalopay', name: 'Thanh toán qua ZaloPay', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip3_6.png' },
    { id: 'vnpay', name: 'Ví điện tử VNPAY', icon: 'https://mcdn.coolmate.me/image/October2024/mceclip0_81.png', details: 'Quét QR để thanh toán' },
];
const sampleVouchers = [
    { id: 'vc1', code: 'COOL55', discount: 55000, condition: 'Đơn 500k', expiry: '06/05/2025', desc: '[Deal 5.5 Giảm 55k đơn từ 500k]' },
    { id: 'vc2', code: 'COOL25', discount: 25000, condition: 'Đơn 150k', expiry: '06/05/2025', desc: '[Deal 5.5 Giảm 25k đơn từ 150k]' },
]

function ShoppingCartPage() {
  const { user, token, isAuthenticated } = useAuth();
  // 2. Khởi tạo navigate
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    namePrefix: 'Anh/Chị', name: '', phone: '', email: '', address: '',
    notes: '', isGift: false,
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);

  // LẤY THÊM HÀM `fetchCart` TỪ CONTEXT
  const { 
    cartItems, 
    isLoading: isLoadingCart, 
    updateCartItem, 
    removeFromCart, 
    fetchCart, // <- THAY THẾ clearCart BẰNG fetchCart ĐỂ ĐỒNG BỘ VỚI SERVER
  } = useCart();
  
  const [selectedItems, setSelectedItems] = useState(new Set());

  useEffect(() => {
    if (cartItems.length > 0) {
        setSelectedItems(new Set(cartItems.map(item => item.id)));
    }
  }, [cartItems]);


  const selectedCartItems = useMemo(() => {
    return cartItems.filter(item => selectedItems.has(item.id));
  }, [cartItems, selectedItems]);

  const subtotal = useMemo(() => {
    return selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [selectedCartItems]);


  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prevSelected => {
        const newSelected = new Set(prevSelected);
        if (newSelected.has(itemId)) {
            newSelected.delete(itemId);
        } else {
            newSelected.add(itemId);
        }
        return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
        setSelectedItems(new Set(cartItems.map(item => item.id)));
    } else {
        setSelectedItems(new Set());
    }
  };

  const total = useMemo(() => {
    const calculatedTotal = subtotal - appliedDiscount + shippingFee;
    return calculatedTotal > 0 ? calculatedTotal : 0;
  }, [subtotal, appliedDiscount, shippingFee]);

  const handleApplyVoucher = () => {
    const voucher = sampleVouchers.find(v => v.code === voucherCode);
    if (voucher) {
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
  };

  
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (selectedCartItems.length === 0) {
        alert("Bạn chưa chọn sản phẩm nào để đặt hàng.");
        return;
    }

    const errors = [];
    if (!formData.name.trim()) errors.push("Họ và tên");
    if (!formData.phone.trim()) errors.push("Số điện thoại");
    if (!formData.address.trim()) errors.push("Địa chỉ đầy đủ");

    if (errors.length > 0) {
        alert(`Vui lòng điền đầy đủ thông tin bắt buộc:\n- ${errors.join("\n- ")}`);
        return;
    }
    
    const orderPayload = {
      customer_id: user.id,
      address: formData.address,
      phone_number: formData.phone,
      total_price: total,
      status: 'pending',
      payment_method: selectedPayment,
      notes: formData.notes,
      items: selectedCartItems.map(item => ({
        productId: item.productId,
        colorProductId: item.colorProductId,
        sizeProductId: item.sizeProductId,
        quantity: item.quantity,
      }))
    };

    try {
        const orderResponse = await axios.post('https://benodejs-9.onrender.com/api/orders', orderPayload, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (orderResponse.data.success) {
            alert("Đặt hàng thành công!");
            navigate(`/order/${orderResponse.data.data.id}`);

            // Bắt đầu quá trình xóa các sản phẩm đã mua khỏi giỏ hàng
            try {
                // Tạo một mảng các promises để xóa các sản phẩm song song
                const deletePromises = selectedCartItems.map(item =>
                    axios.delete(`https://benodejs-9.onrender.com/api/carts/${item.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                );

                // Chờ cho tất cả các yêu cầu xóa hoàn tất
                await Promise.all(deletePromises);

            } catch (deleteError) {
                console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng sau khi đặt hàng:", deleteError);
                // Dù có lỗi xóa, vẫn nên cập nhật lại giỏ hàng để người dùng thấy trạng thái mới nhất
            } finally {
                // Luôn gọi fetchCart() để làm mới giỏ hàng từ server
                // Điều này sẽ hiển thị đúng các sản phẩm còn lại (nếu có)
                fetchCart();
            }
        } else {
            const errorMessage = Array.isArray(orderResponse.data.message) 
                ? orderResponse.data.message.join('\n') 
                : orderResponse.data.message;
            alert(`Đặt hàng thất bại: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error placing order:", error);
        const serverError = error.response?.data?.message;
        const errorMessage = Array.isArray(serverError) 
            ? serverError.join('\n') 
            : (serverError || 'Không thể kết nối đến máy chủ');
        alert(`Lỗi khi đặt hàng: ${errorMessage}`);
    }
  };
  // ====================================================================
  // === KẾT THÚC PHẦN CẬP NHẬT                                        ===
  // ====================================================================


  if (!isAuthenticated) {
      return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-2xl font-semibold mb-4">Vui lòng đăng nhập</h1>
              <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem giỏ hàng và đặt hàng.</p>
              <a href="/login" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                 Đăng nhập ngay
              </a>
          </div>
      )
  }

  if (cartItems.length === 0 && !isLoadingCart) {
      return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h1>
              <p className="text-gray-600 mb-6">Hãy quay lại và chọn cho mình sản phẩm ưng ý nhé!</p>
              <a href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                 Tiếp tục mua sắm
              </a>
          </div>
      )
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, newQuantity);
    updateCartItem(itemId, quantity);
  };

  const handleRemoveItem = (itemId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      removeFromCart(itemId);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 xl:gap-x-12">
          <div className="lg:col-span-7 mb-10 lg:mb-0">
            <section aria-labelledby="customer-info-heading" className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 id="customer-info-heading" className="text-xl font-semibold text-gray-900 mb-5">Thông tin đặt hàng</h2>
              <form onSubmit={handlePlaceOrder}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
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

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                    <input type="tel" name="phone" id="phone" placeholder="Nhập số điện thoại của bạn" required value={formData.phone} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" name="email" id="email" placeholder="Theo dõi đơn hàng sẽ được gửi qua Email" value={formData.email} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ <span className="text-red-500">*</span></label>
                    <input type="text" name="address" id="address" placeholder="Ví dụ: 103 Vạn Phúc, Phường Vạn Phúc, Quận Ba Đình, Hà Nội" required value={formData.address} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5" />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                    <textarea name="notes" id="notes" rows="3" placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)" value={formData.notes} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2.5"></textarea>
                  </div>

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
              </form>
            </section>
            
            <section aria-labelledby="payment-heading" className="bg-white p-6 rounded-lg shadow-sm">
              <h2 id="payment-heading" className="text-xl font-semibold text-gray-900 mb-5">Hình thức thanh toán</h2>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    htmlFor={`payment-${method.id}`}
                    className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors duration-150 ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      id={`payment-${method.id}`}
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={(e) => setSelectedPayment(e.target.value)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 mt-1 mr-3 cursor-pointer"
                    />
                    <div className="flex-grow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {method.icon && <img src={method.icon} alt="" className="h-6 mr-2 object-contain"/>}
                                <span className="text-sm font-medium text-gray-800">{method.name}</span>
                            </div>
                        </div>
                       {method.details && <p className="text-xs text-gray-500 mt-1">{method.details}</p>}
                    </div>
                  </label>
                ))}
              </div>
               <p className="text-xs text-gray-500 mt-6">Nếu bạn không hài lòng với sản phẩm của chúng tôi? Coolmate hoàn tiền hoặc đổi hàng miễn phí. Tìm hiểu thêm <a href="#" className="text-blue-600 hover:underline font-medium">tại đây</a>.</p>
            </section>
          </div>
          
          <div className="lg:col-span-5">
             <section aria-labelledby="cart-heading" className="bg-white p-6 rounded-lg shadow-sm mb-6">
                 <div className="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 id="cart-heading" className="text-xl font-semibold text-gray-900">Giỏ hàng ({cartItems.length} sản phẩm)</h2>
                 </div>
                 <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="select-all"
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={handleSelectAll}
                        checked={cartItems.length > 0 && selectedItems.size === cartItems.length}
                    />
                    <label htmlFor="select-all" className="ml-3 text-sm text-gray-700">
                        Chọn tất cả ({selectedItems.size}/{cartItems.length} sản phẩm)
                    </label>
                 </div>

                 {subtotal < 269000 && selectedItems.size > 0 && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded-md mb-5 flex items-center justify-between gap-2">
                        <span>🎁 Mua thêm <span className='font-bold'>{formatPrice(269000 - subtotal)}</span> để nhận quà <span className='font-bold'>trị giá 249k</span></span>
                        <a href="/" className="flex-shrink-0 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded hover:bg-blue-700 transition-colors">Mua ngay</a>
                    </div>
                 )}
                 <ul role="list" className="divide-y divide-gray-200">
                     {cartItems.map((item) => (
                         <li key={item.id} className="flex items-center py-4 sm:py-5 gap-4">
                             <input
                                type="checkbox"
                                id={`item-${item.id}`}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                checked={selectedItems.has(item.id)}
                                onChange={() => handleSelectItem(item.id)}
                              />
                             <div className="flex-shrink-0">
                                 <a href={`#product/${item.productId}`}>
                                    <img src={item.image} alt={item.name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-md object-cover border border-gray-200 hover:opacity-90 transition-opacity" />
                                 </a>
                             </div>
                             <div className="flex-1 flex flex-col justify-between">
                                 <div>
                                     <div className="flex justify-between items-start gap-2">
                                         <h3 className="text-sm font-medium text-gray-800 hover:text-indigo-600 leading-tight">
                                             <a href={`#product/${item.productId}`}>{item.name}</a>
                                         </h3>
                                         <p className="ml-2 flex-shrink-0 text-sm font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                                     </div>
                                     <p className="mt-1 text-xs text-gray-500">
                                         {item.color} / {item.size}
                                         {item.originalPrice > item.price && (
                                            <span className="ml-2 line-through text-gray-400">{formatPrice(item.originalPrice * item.quantity)}</span>
                                         )}
                                     </p>
                                 </div>
                                 <div className="mt-2 flex items-center justify-between">
                                     <QuantitySelector
                                        quantity={item.quantity}
                                        onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                                        onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                                        isLoadingCart={isLoadingCart}
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

             <section className="mb-6">
                 <p className="text-sm text-gray-600 mb-3">Có {sampleVouchers.length} mã giảm giá có thể sử dụng:</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {sampleVouchers.map(vc => (
                         <div key={vc.id} className="bg-white border border-dashed border-blue-300 p-3 rounded-lg shadow-sm flex flex-col justify-between text-xs relative overflow-hidden">
                              <div className="absolute top-0 left-0 w-4 h-4 bg-blue-500" style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
                             <div className="pl-2">
                                <p className="font-semibold text-blue-700">{vc.code}</p>
                                <p className="text-gray-600 mt-1">{vc.desc}</p>
                                <p className="text-gray-400 mt-1">HSD: {vc.expiry}</p>
                             </div>
                              <button
                                onClick={() => { setVoucherCode(vc.code); handleApplyVoucher(); }}
                                className="text-blue-600 hover:text-blue-800 mt-2 text-left font-medium text-sm transition-colors"
                              >
                                Áp dụng ngay
                              </button>
                         </div>
                     ))}
                 </div>
             </section>

             <section className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
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

             <section aria-labelledby="summary-heading" className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                <h2 id="summary-heading" className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Tổng cộng</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Tạm tính ({selectedItems.size} sản phẩm)</span>
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
                        <span className="font-medium text-gray-900">{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-semibold">
                        <span>Tổng cộng</span>
                        <span>{formatPrice(total)}</span>
                    </div>
                     <p className="text-xs text-right text-gray-500">(Đã bao gồm VAT nếu có)</p>
                </div>

                <p className="text-xs text-blue-600 mt-4 text-center bg-blue-50 p-2 rounded">
                    Đăng nhập/Đăng ký để hoàn <span className='font-bold'>{formatPrice(Math.floor(subtotal * 0.03))} CoolCash</span> vào ví
                </p>

                <div className="mt-6">
                  <Link to = "/order">
                    <button
                        type="button"
                        onClick={handlePlaceOrder}
                        className="w-full bg-gray-900 text-white py-3 px-4 rounded-md shadow-sm text-base font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 disabled:opacity-60 disabled:cursor-wait transition-all"
                        disabled={!formData.name || !formData.phone || !formData.address || selectedItems.size === 0}
                    >
                       {`Tiến hành đặt hàng (${selectedItems.size} sản phẩm)`}
                    </button>
                    </Link>
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartPage;