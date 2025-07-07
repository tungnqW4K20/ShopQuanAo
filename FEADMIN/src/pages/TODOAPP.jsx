import React, { useState } from 'react';

// Dữ liệu giả để hiển thị ban đầu
const initialCategories = [
  {
    id: 'DM001',
    name: 'Thiết bị điện tử',
    imageUrl: 'https://evn.com.vn/UserFile/User/thuhatcdl/2013/5/thiet-bi-dien-tu.jpg',
  },
  {
    id: 'DM002',
    name: 'Thời trang và Phụ kiện',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'DM003',
    name: 'Sách và Văn phòng phẩm',
    imageUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
  },
   {
    id: 'DM004',
    name: 'Nhà cửa và Đời sống',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
  },
];

// Giữ lại tên function gốc là TODOAPP
function TODOAPP() {
  const [categories, setCategories] = useState(initialCategories);

  // === State quản lý giao diện (UI State) ===
  const [isFormOpen, setIsFormOpen] = useState(false); // Trạng thái đóng/mở form
  const [formMode, setFormMode] = useState('add'); // Chế độ form: 'add' hoặc 'edit'
  const [currentCategory, setCurrentCategory] = useState(null); // Dữ liệu danh mục đang sửa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // Trạng thái hiển thị xác nhận xóa
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Dữ liệu danh mục sẽ bị xóa

  // === Các hàm xử lý sự kiện (Event Handlers) ===

  // Mở form để thêm mới
  const handleAddNew = () => {
    setFormMode('add');
    // Khởi tạo đối tượng rỗng cho form thêm mới
    setCurrentCategory({ id: '', name: '', imageUrl: '' });
    setIsFormOpen(true);
  };

  // Mở form để chỉnh sửa
  const handleEdit = (category) => {
    setFormMode('edit');
    // Sao chép dữ liệu của danh mục vào state để không bị tham chiếu
    setCurrentCategory({ ...category });
    setIsFormOpen(true);
  };

  // Mở hộp thoại xác nhận xóa
  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  // Đóng form và reset
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setCurrentCategory(null);
  };

  // Đóng hộp thoại xác nhận xóa
  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  // Hàm xử lý khi submit form (hiện tại chỉ đóng form)
  const handleSubmitForm = (event) => {
    event.preventDefault(); // Ngăn trình duyệt reload
    // Logic thêm/sửa thực tế sẽ được thêm vào đây
    if (formMode === 'add') {
      console.log('Adding new category:', currentCategory);
    } else {
      console.log('Updating category:', currentCategory);
    }
    handleCloseForm(); // Đóng form sau khi submit
  };

  // Hàm xử lý khi xác nhận xóa (hiện tại chỉ đóng hộp thoại)
  const handleConfirmDelete = () => {
    // Logic xóa thực tế sẽ được thêm vào đây
    console.log('Deleting category:', categoryToDelete);
    handleCancelDelete(); // Đóng hộp thoại sau khi "xóa"
  };

  // Hàm xử lý thay đổi trên input của form
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Quản lý danh mục sản phẩm
      </h1>
      
      {/* Nút Thêm mới danh mục */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleAddNew}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          + Thêm mới danh mục
        </button>
      </div>

      {/* === Modal Form Thêm/Sửa === */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <h2 className="text-2xl font-semibold mb-5 text-gray-700">
              {formMode === 'add' ? 'Thêm mới danh mục' : 'Cập nhật danh mục'}
            </h2>
            <form onSubmit={handleSubmitForm}>
              <div className="grid grid-cols-1 gap-6">
                 {/* ID danh mục (chỉ cho nhập khi thêm mới) */}
                <div>
                  <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                    Mã danh mục
                  </label>
                  <input
                    type="text"
                    name="id"
                    id="category_id"
                    value={currentCategory?.id || ''}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 disabled:bg-gray-100"
                    placeholder="Ví dụ: DM005"
                    disabled={formMode === 'edit'} // Vô hiệu hóa khi sửa
                    required
                  />
                </div>
                {/* Tên danh mục */}
                <div>
                  <label htmlFor="category_name" className="block text-sm font-medium text-gray-700 mb-1">
                    Tên danh mục
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="category_name"
                    value={currentCategory?.name || ''}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Ví dụ: Thời trang nam"
                    required
                  />
                </div>
                {/* URL Ảnh danh mục */}
                <div>
                  <label htmlFor="category_image" className="block text-sm font-medium text-gray-700 mb-1">
                    URL Ảnh danh mục
                  </label>
                  <input
                    type="text"
                    name="imageUrl"
                    id="category_image"
                    value={currentCategory?.imageUrl || ''}
                    onChange={handleFormChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
                    placeholder="Ví dụ: https://example.com/image.png"
                    required
                  />
                </div>
              </div>

              {/* Nút bấm */}
              <div className="mt-6 flex justify-end space-x-3">
                 <button
                  type="button"
                  onClick={handleCloseForm}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {formMode === 'add' ? 'Thêm' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* === Modal Xác nhận Xóa === */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                <h3 className="text-lg font-medium text-gray-900">Xác nhận xóa</h3>
                <div className="mt-2">
                    <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa danh mục 
                        <strong className="text-gray-900"> "{categoryToDelete?.name}"</strong> không? 
                        Hành động này không thể hoàn tác.
                    </p>
                </div>
                <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={handleCancelDelete}
                        className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Hủy
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirmDelete}
                        className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:w-auto sm:text-sm"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Bảng hiển thị danh sách danh mục */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <h2 className="text-2xl font-semibold p-6 text-gray-700">Danh sách danh mục</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã danh mục</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ảnh</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên danh mục</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img className="h-12 w-12 rounded-md object-cover" src={category.imageUrl} alt={category.name} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-4">
                      <button 
                        onClick={() => handleEdit(category)} 
                        className="text-yellow-600 hover:text-yellow-900 transition-colors duration-200"
                      >
                        Sửa
                      </button>
                      <button 
                        onClick={() => handleDelete(category)} 
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Giữ lại export default với tên gốc
export default TODOAPP;