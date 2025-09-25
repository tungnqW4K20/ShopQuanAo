import React, { useState, useEffect, useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';
import QuantitySelector from './QuantitySelector';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const {
    cartItems,
    isLoading: isLoadingCart,
    updateCartItem,
    removeFromCart,
    fetchCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', address: '',
    notes: '', isGift: false, namePrefix: 'Anh/Chị',
  });
  const [selectedPayment, setSelectedPayment] = useState('cod');
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());

  // Safeguard: Xóa giỏ hàng local nếu người dùng đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      const localCart = window.localStorage.getItem('guestCart');
      if (localCart) {
        window.localStorage.removeItem('guestCart');
        fetchCart();
      }
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (cartItems.length > 0) {
        setSelectedItems(new Set(cartItems.map(item => item.id)));
    } else {
        setSelectedItems(new Set());
    }
  }, [cartItems]);

  useEffect(() => {
    if (user && isAuthenticated) {
      setFormData(prev => ({
        ...prev, name: user.name || '', phone: user.phone || '', email: user.email || '', address: user.address || ''
      }));
    } else {
      setFormData({ name: '', phone: '', email: '', address: '', notes: '', isGift: false, namePrefix: 'Anh/Chị' });
    }
  }, [user, isAuthenticated]);

  const selectedCartItems = useMemo(() => cartItems.filter(item => selectedItems.has(item.id)), [cartItems, selectedItems]);
  const subtotal = useMemo(() => selectedCartItems.reduce((total, item) => total + item.price * item.quantity, 0), [selectedCartItems]);
  const total = useMemo(() => Math.max(0, subtotal - appliedDiscount + shippingFee), [subtotal, appliedDiscount, shippingFee]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(itemId)) newSelected.delete(itemId);
        else newSelected.add(itemId);
        return newSelected;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedItems(new Set(cartItems.map(item => item.id)));
    else setSelectedItems(new Set());
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

    if (isAuthenticated) {
        const orderPayload = {
            customer_id: user.id, address: formData.address, phone_number: formData.phone, total_price: total,
            status: 'pending', payment_method: selectedPayment, notes: formData.notes,
            items: selectedCartItems.map(item => ({
                productId: item.productId, colorProductId: item.colorProductId, sizeProductId: item.sizeProductId, quantity: item.quantity
            }))
        };
        try {
            const response = await axios.post('https://benodejs-9.onrender.com/api/orders', orderPayload, { headers: { 'Authorization': `Bearer ${token}` } });
            if (response.data.success) {
                alert("Đặt hàng thành công!");
                await fetchCart();
                navigate(`/order/${response.data.data.id}`);
            } else { alert(`Đặt hàng thất bại: ${response.data.message}`); }
        } catch (error) { alert(`Lỗi khi đặt hàng: ${error.response?.data?.message || 'Lỗi máy chủ'}`); }
    } else {
        // ====================================================================
        // === BẮT ĐẦU PHẦN SỬA LỖI                                         ===
        // ====================================================================
        const guestOrderPayload = {
            customerInfo: { name: formData.name, email: formData.email, phone: formData.phone, address: formData.address },
            items: selectedCartItems.map(item => ({
                productId: item.productId,
                colorProductId: item.colorProductId,
                sizeProductId: item.sizeProductId,
                quantity: item.quantity,
                imageUrl: item.image // <-- THÊM TRƯỜNG CÒN THIẾU VÀO ĐÂY
            }))
        };
        // ====================================================================
        // === KẾT THÚC PHẦN SỬA LỖI                                         ===
        // ====================================================================
        try {
            const response = await axios.post('https://benodejs-9.onrender.com/api/orders/guest', guestOrderPayload);
            if (response.data.success) {
                const guestOrderData = {
                  customer: formData, items: selectedCartItems, total, subtotal,
                  shipping_fee: shippingFee, discount: appliedDiscount,
                  payment_method: selectedPayment, createdAt: new Date().toISOString()
                };
                // Xóa giỏ hàng local sau khi đặt hàng thành công
                window.localStorage.removeItem('guestCart');
                navigate('/order-success', { state: { guestOrder: guestOrderData } });
            } else { alert(`Đặt hàng thất bại: ${response.data.message}`); }
        } catch (error) { alert(`Lỗi khi đặt hàng: ${error.response?.data?.message || 'Lỗi máy chủ'}`); }
    }
  };

  if (cartItems.length === 0 && !isLoadingCart) {
      return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
              <h1 className="text-2xl font-semibold mb-4">Giỏ hàng của bạn đang trống</h1>
              <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">Tiếp tục mua sắm</Link>
          </div>
      )
  }

  const handleQuantityChange = (itemId, newQuantity) => updateCartItem(itemId, Math.max(1, newQuantity));
  const handleRemoveItem = (itemId) => { if (window.confirm("Bạn có muốn xóa sản phẩm này?")) removeFromCart(itemId); };

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
                                <select id="namePrefix" name="namePrefix" value={formData.namePrefix} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2.5 bg-gray-50"><option>Anh/Chị</option><option>Anh</option><option>Chị</option></select>
                            </div>
                            <div className="w-3/4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                                <input type="text" name="name" id="name" placeholder="Nhập họ tên của bạn" required value={formData.name} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2.5" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                            <input type="tel" name="phone" id="phone" placeholder="Nhập số điện thoại của bạn" required value={formData.phone} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2.5" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" id="email" placeholder="Theo dõi đơn hàng sẽ được gửi qua Email" value={formData.email} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2.5" />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ đầy đủ <span className="text-red-500">*</span></label>
                            <input type="text" name="address" id="address" placeholder="Ví dụ: 123 Vạn Phúc, Ba Đình, Hà Nội" required value={formData.address} onChange={handleInputChange} className="block w-full border-gray-300 rounded-md shadow-sm p-2.5" />
                        </div>
                    </div>
                </form>
            </section>
            <section aria-labelledby="payment-heading" className="bg-white p-6 rounded-lg shadow-sm">
                <h2 id="payment-heading" className="text-xl font-semibold text-gray-900 mb-5">Hình thức thanh toán</h2>
                <div className="space-y-4">
                    {paymentMethods.map((method) => (<label key={method.id} htmlFor={`payment-${method.id}`} className={`flex items-start p-4 border rounded-lg cursor-pointer ${selectedPayment === method.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}><input type="radio" id={`payment-${method.id}`} name="paymentMethod" value={method.id} checked={selectedPayment === method.id} onChange={(e) => setSelectedPayment(e.target.value)} className="h-4 w-4 mt-1 mr-3"/><div className="flex-grow"><div className="flex items-center">{method.icon && <img src={method.icon} alt="" className="h-6 mr-2"/>}<span>{method.name}</span></div>{method.details && <p className="text-xs text-gray-500 mt-1">{method.details}</p>}</div></label>))}
                </div>
            </section>
          </div>
          <div className="lg:col-span-5">
             <section aria-labelledby="cart-heading" className="bg-white p-6 rounded-lg shadow-sm mb-6">
                 <div className="flex justify-between items-center border-b pb-4 mb-4"><h2 id="cart-heading" className="text-xl font-semibold">Giỏ hàng ({cartItems.length})</h2></div>
                 <div className="flex items-center mb-4"><input type="checkbox" id="select-all" className="h-4 w-4" onChange={handleSelectAll} checked={cartItems.length > 0 && selectedItems.size === cartItems.length}/><label htmlFor="select-all" className="ml-3 text-sm">Chọn tất cả ({selectedItems.size}/{cartItems.length})</label></div>
                 <ul role="list" className="divide-y divide-gray-200">{cartItems.map((item) => (<li key={item.id} className="flex items-center py-4 gap-4"><input type="checkbox" id={`item-${item.id}`} className="h-4 w-4" checked={selectedItems.has(item.id)} onChange={() => handleSelectItem(item.id)}/><div className="flex-shrink-0"><Link to={`/product/${item.productId}`}><img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover border" /></Link></div><div className="flex-1 flex flex-col justify-between"><div><div className="flex justify-between items-start"><h3 className="text-sm font-medium"><Link to={`/product/${item.productId}`}>{item.name}</Link></h3><p className="ml-2 flex-shrink-0 text-sm font-medium">{formatPrice(item.price * item.quantity)}</p></div><p className="mt-1 text-xs text-gray-500">{item.color} / {item.size}</p></div><div className="mt-2 flex items-center justify-between"><QuantitySelector quantity={item.quantity} onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)} onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)} isLoadingCart={isLoadingCart}/><button type="button" onClick={() => handleRemoveItem(item.id)} className="ml-4 text-xs font-medium text-red-600 hover:text-red-500 flex items-center"><TrashIcon className="h-4 w-4 mr-1"/> Xóa</button></div></div></li>))}</ul>
             </section>
             <section aria-labelledby="summary-heading" className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
                <h2 id="summary-heading" className="text-lg font-semibold border-b pb-2 mb-4">Tổng cộng</h2>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span>Tạm tính ({selectedItems.size} sản phẩm)</span><span>{formatPrice(subtotal)}</span></div>
                    {appliedDiscount > 0 && (<div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatPrice(appliedDiscount)}</span></div>)}
                    <div className="flex justify-between"><span>Phí giao hàng</span><span>{shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}</span></div>
                    <div className="flex justify-between pt-3 border-t text-base font-semibold"><span>Tổng cộng</span><span>{formatPrice(total)}</span></div>
                </div>
                {!isAuthenticated && (
                  <p className="text-xs text-blue-600 mt-4 text-center bg-blue-50 p-2 rounded">
                      <Link to="/login" className='font-bold hover:underline'>Đăng nhập</Link> để nhận thêm ưu đãi!
                  </p>
                )}
                <div className="mt-6">
                    <button type="button" onClick={handlePlaceOrder} className="w-full bg-gray-900 text-white py-3 rounded-md font-medium hover:bg-gray-700 disabled:opacity-50" disabled={!formData.name || !formData.phone || !formData.address || selectedItems.size === 0}>
                       Tiến hành đặt hàng ({selectedItems.size} sản phẩm)
                    </button>
                </div>
             </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCartPage;