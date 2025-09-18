import React, { useState, useEffect, useRef } from 'react';
import uploadApiService from '../../services/uploadApiService';
import { AiOutlineCloudUpload, AiOutlineClose } from 'react-icons/ai';

function CategoryModal({ onClose, onSubmit, category }) {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
      if (category) {
        setName(category.name);
        setImageUrl(category.image_url);
      } else {
        setName('');
        setImageUrl(null);
      }
      setSelectedFile(null);
      setError('');
      setIsUploading(false);
  }, [category]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setImageUrl(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tên danh mục không được để trống.');
      return;
    }
    setError('');

    let finalImageUrl = category?.image_url;

    if (imageUrl === null && category?.image_url) {
        finalImageUrl = null;
    }

    try {
        if (selectedFile) {
            setIsUploading(true);
            finalImageUrl = await uploadApiService.uploadProductImage(selectedFile);
            setIsUploading(false);
        }
        
        onSubmit({ name, image_url: finalImageUrl });

    } catch (uploadError) {
        setIsUploading(false);
        setError(uploadError.message);
    }
  };

  const handleClose = () => {
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="relative bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center pb-3 border-b">
            <h2 className="text-2xl font-bold text-gray-800">
              {category ? 'Chỉnh Sửa Danh Mục' : 'Tạo Danh Mục Mới'}
            </h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
              Tên Danh mục <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-md focus:ring-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300"
              placeholder="Ví dụ: Áo thun, Quần jeans..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Danh mục</label>
            <div className="mt-1 flex items-center space-x-4">
                <div className="w-24 h-24 rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imageUrl ? (
                        <img src={imageUrl} alt="Preview" className="w-full h-full object-cover"/>
                    ) : (
                        <span className="text-gray-400 text-sm text-center">Xem trước</span>
                    )}
                </div>
                <div className="flex flex-col space-y-2">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="hidden"
                        ref={fileInputRef}
                    />
                    <button type="button" onClick={() => fileInputRef.current.click()} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <AiOutlineCloudUpload className="mr-2"/>
                        Chọn ảnh
                    </button>
                    {imageUrl && (
                        <button type="button" onClick={handleRemoveImage} className="flex items-center px-4 py-2 bg-red-50 border border-red-200 rounded-md text-sm font-medium text-red-600 hover:bg-red-100">
                           <AiOutlineClose className="mr-2"/>
                            Xóa ảnh
                        </button>
                    )}
                </div>
            </div>
          </div>
          
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="flex justify-end items-center space-x-4 pt-4">
            <button type="button" onClick={handleClose} className="px-5 py-2.5 bg-gray-100 text-gray-800 rounded-md font-semibold hover:bg-gray-200">
              Hủy Bỏ
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
            >
              {isUploading ? 'Đang tải lên...' : (category ? 'Lưu Thay Đổi' : 'Thêm Mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CategoryModal;