import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({
    products,               // Sản phẩm để hiển thị
    totalFilteredCount,     // Tổng số sản phẩm sau khi lọc (từ component cha)
    visibleCount,           // Số lượng đang hiển thị (từ component cha)
    onLoadMore,             // Hàm xử lý khi nhấn nút "Xem thêm"
    isLoadingMore,          // Trạng thái đang tải thêm
    canLoadMore,            // Prop mới: Cho biết có thể tải thêm sản phẩm hay không
    selectedSort,           // Giá trị sắp xếp hiện tại
    onSortChange            // Hàm xử lý khi thay đổi sắp xếp
}) => {


  return (
    <div className="flex-1">
      <div className="mb-6">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-500 mb-4">
           <ol role="list" className="flex items-center space-x-1">
            <li><a href="#" className="hover:text-gray-700">Trang chủ</a></li>
            <li><span className="mx-1">/</span></li>
            <li className="font-medium text-gray-700">Sản phẩm</li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-baseline md:items-center">
           <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2 md:mb-0">Tất cả sản phẩm</h1>
           <div className="flex items-center space-x-4">
             <p className="text-sm text-gray-500">{totalFilteredCount} kết quả</p>
             {/* Sort Dropdown */}
             <div className="relative inline-block text-left">
               <select
                  id="sort-options"
                  name="sort-options"
                  className="block w-full rounded-md border-gray-300 py-1.5 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  value={selectedSort}
                  onChange={(e) => onSortChange(e.target.value)}
                >
                  <option value="ban-chay">Bán chạy</option>
                  <option value="moi-nhat">Mới nhất</option>
                  <option value="gia-thap-cao">Giá: Thấp đến Cao</option>
                  <option value="gia-cao-thap">Giá: Cao đến Thấp</option>
                </select>
             </div>
           </div>
        </div>
      </div>

       {products.length > 0 ? (
           <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
             {products.map((product) => (
               <ProductCard key={product.id} product={product} />
             ))}
           </div>
        ) : (
            <div className="text-center py-16 px-4">
                <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Vui lòng thử lại với bộ lọc khác hoặc xóa bớt bộ lọc.
                </p>
            </div>
        )}

      {canLoadMore && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center rounded-md border border-transparent bg-gray-800 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingMore ? 'ĐANG TẢI...' : 'XEM THÊM'}
          </button>
        </div>
      )}

       {totalFilteredCount > 0 && (
         <p className="mt-4 text-center text-sm text-gray-500">
            Hiển thị {visibleCount} / {totalFilteredCount} sản phẩm
         </p>
       )}
    </div>
  );
};

export default ProductGrid;