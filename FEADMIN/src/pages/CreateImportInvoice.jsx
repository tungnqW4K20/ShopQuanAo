import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import importInvoiceApiService from '../services/importInvoiceApiService';
import productApiService from '../services/productApiService';
import supplierApiService from '../services/supplierApiService';

const ProductSelectionModal = ({ isOpen, onClose, onProductSelected }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const allProducts = await productApiService.getAllProducts(); 
          setProducts(allProducts);
        } catch (error) {
          toast.error("Không thể tải danh sách sản phẩm.");
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [isOpen]);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chọn sản phẩm</h2>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên..."
            className="w-full p-2 border rounded mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="overflow-y-auto flex-grow">
            {loading ? <p>Đang tải...</p> : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border rounded-lg p-2 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onProductSelected(product)}>
                    <img src={product.image_url} alt={product.name} className="w-full h-32 object-cover rounded-md mb-2" />
                    <p className="font-semibold text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">Giá: {Number(product.price).toLocaleString()}đ</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={onClose} className="mt-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded">Đóng</button>
        </div>
      </div>
    )
  );
};


// Trang chính
function CreateImportInvoice() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [invoiceDetails, setInvoiceDetails] = useState([]);
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState({ colors: [], sizes: [] });
  const [loadingVariants, setLoadingVariants] = useState(false);

  // *** THAY ĐỔI 1: THÊM STATE ĐỂ QUẢN LÝ DỮ LIỆU FORM CHI TIẾT ***
  const [detailColor, setDetailColor] = useState('');
  const [detailSize, setDetailSize] = useState('');
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [detailPrice, setDetailPrice] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await supplierApiService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        toast.error("Không thể tải danh sách nhà cung cấp.");
        console.error(error);
      }
    };
    fetchSuppliers();
  }, []);

  const handleProductSelected = async (product) => {
    setModalOpen(false);
    setSelectedProduct(product);
    setLoadingVariants(true);
    try {
      const variantData = await productApiService.getProductVariants(product.id);
      setVariants(variantData);
      
      // *** THAY ĐỔI 2: RESET VÀ SET GIÁ TRỊ MẶC ĐỊNH CHO FORM CHI TIẾT KHI CHỌN SẢN PHẨM MỚI ***
      if (variantData.colors.length > 0) {
        setDetailColor(variantData.colors[0].id);
      }
      if (variantData.sizes.length > 0) {
        setDetailSize(variantData.sizes[0].id);
      }
      setDetailQuantity(1);
      setDetailPrice(''); // Để trống cho người dùng nhập

    } catch (error) {
      toast.error(`Lỗi khi tải biến thể cho ${product.name}: ${error.message}`);
      setSelectedProduct(null);
    } finally {
      setLoadingVariants(false);
    }
  };
  
  // *** THAY ĐỔI 3: VIẾT LẠI HOÀN TOÀN HÀM handleAddDetail ĐỂ DÙNG STATE ***
  const handleAddDetail = () => {
    // Không cần e.preventDefault() nữa vì không còn submit form
    if (!detailColor || !detailSize || !detailQuantity || !detailPrice) {
        toast.warn("Vui lòng chọn đủ màu sắc, kích cỡ và nhập số lượng, giá.");
        return;
    }
    
    const isDuplicate = invoiceDetails.some(detail => 
        detail.product_id === selectedProduct.id &&
        detail.color_product_id === parseInt(detailColor) &&
        detail.size_product_id === parseInt(detailSize)
    );

    if (isDuplicate) {
        toast.error("Sản phẩm với màu và kích cỡ này đã được thêm.");
        return;
    }

    const selectedColor = variants.colors.find(c => c.id === parseInt(detailColor));
    const selectedSize = variants.sizes.find(s => s.id === parseInt(detailSize));

    const newDetail = {
        product_id: selectedProduct.id,
        productName: selectedProduct.name,
        color_product_id: parseInt(detailColor),
        colorName: selectedColor.name,
        size_product_id: parseInt(detailSize),
        sizeName: selectedSize.name,
        quantity: parseInt(detailQuantity),
        price: parseFloat(detailPrice),
    };

    setInvoiceDetails([...invoiceDetails, newDetail]);
    // Reset lại product để ẩn form thêm chi tiết
    setSelectedProduct(null); 
  };

  const handleRemoveDetail = (index) => {
    const newDetails = [...invoiceDetails];
    newDetails.splice(index, 1);
    setInvoiceDetails(newDetails);
  };

  const calculateTotal = () => {
    return invoiceDetails.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSupplier) {
      toast.warn("Vui lòng chọn nhà cung cấp.");
      return;
    }
    if (invoiceDetails.length === 0) {
      toast.warn("Vui lòng thêm ít nhất một sản phẩm vào hóa đơn.");
      return;
    }

    setIsSubmitting(true);
    const payload = {
      supliers_id: parseInt(selectedSupplier),
      details: invoiceDetails.map(({ productName, colorName, sizeName, ...rest }) => rest),
    };
    
    try {
        await importInvoiceApiService.createImportInvoice(payload);
        toast.success("Tạo hóa đơn nhập thành công!");
        navigate('/manage/imports');
    } catch (error) {
        toast.error(`Lỗi: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tạo hóa đơn nhập mới</h1>
      
      {/* Thẻ form ngoài cùng vẫn giữ nguyên */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">Nhà cung cấp</label>
                    <select
                        id="supplier"
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">-- Chọn nhà cung cấp --</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button type="button" onClick={() => setModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg w-full">
                        Thêm sản phẩm vào hóa đơn
                    </button>
                </div>
            </div>
        </div>

        {/* *** THAY ĐỔI 4: BỎ THẺ <form> LỒNG NHAU, SỬA INPUT ĐỂ DÙNG STATE *** */}
        {selectedProduct && (
            <div className="bg-white p-6 rounded-lg shadow-md animate-fade-in-down">
                <h3 className="text-lg font-semibold mb-4">Thêm chi tiết cho: <span className="text-blue-600">{selectedProduct.name}</span></h3>
                {loadingVariants ? <p>Đang tải biến thể...</p> : (
                    // Bỏ thẻ <form> ở đây
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium">Màu sắc</label>
                            <select 
                                name="color" 
                                value={detailColor}
                                onChange={(e) => setDetailColor(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md"
                            >
                                {variants.colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Kích cỡ</label>
                            <select 
                                name="size" 
                                value={detailSize}
                                onChange={(e) => setDetailSize(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md"
                            >
                                {variants.sizes.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Số lượng</label>
                            <input 
                                type="number" 
                                name="quantity" 
                                min="1" 
                                required 
                                value={detailQuantity}
                                onChange={(e) => setDetailQuantity(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md" 
                            />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Giá nhập / sản phẩm</label>
                            <input 
                                type="number" 
                                name="price" 
                                min="0" 
                                required 
                                value={detailPrice}
                                onChange={(e) => setDetailPrice(e.target.value)}
                                className="mt-1 block w-full p-2 border rounded-md" 
                            />
                        </div>
                        <div className="md:col-span-4 flex justify-end space-x-2">
                             <button type="button" onClick={() => setSelectedProduct(null)} className="bg-gray-500 text-white px-4 py-2 rounded-md">Hủy</button>
                             {/* Thay type="submit" thành type="button" và gọi hàm qua onClick */}
                             <button type="button" onClick={handleAddDetail} className="bg-blue-600 text-white px-4 py-2 rounded-md">Thêm vào hóa đơn</button>
                        </div>
                    </div>
                )}
            </div>
        )}
        
        {/* Bảng chi tiết hóa đơn (giữ nguyên) */}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Chi tiết hóa đơn</h2>
            <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Màu</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá nhập</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoiceDetails.length === 0 ? (
                            <tr><td colSpan="7" className="text-center py-4">Chưa có sản phẩm nào</td></tr>
                        ) : (
                            invoiceDetails.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.colorName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.sizeName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.price.toLocaleString()}đ</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{(item.quantity * item.price).toLocaleString()}đ</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <button type="button" onClick={() => handleRemoveDetail(index)} className="text-red-600 hover:text-red-900">Xóa</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-gray-50">
                        <tr>
                            <td colSpan="5" className="px-6 py-3 text-right font-bold">Tổng cộng:</td>
                            <td className="px-6 py-3 text-right font-bold">{calculateTotal().toLocaleString()}đ</td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        {/* Nút submit (giữ nguyên) */}
        <div className="flex justify-end">
            <button type="button" onClick={() => navigate('/manage/imports')} className="bg-gray-200 text-gray-700 font-bold py-2 px-6 rounded-lg mr-4">
                Hủy
            </button>
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg disabled:bg-blue-300"
            >
                {isSubmitting ? 'Đang lưu...' : 'Lưu hóa đơn'}
                
            </button>
        </div>
      </form>

      <ProductSelectionModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onProductSelected={handleProductSelected}
      />
    </div>
  );
}

export default CreateImportInvoice;