import React, { useState, useEffect, useRef } from 'react';
import uploadApiService from '../../services/uploadApiService'; // Import service upload
import { toast } from 'react-toastify';
import { FaTimes, FaSpinner, FaPlus } from 'react-icons/fa'; // Icons

const MAX_IMAGES = 7;
const MAX_FILE_SIZE_MB = 5;

function ColorProductModal({ isOpen, onClose, onSubmit, colorProduct, productId }) {
  const initialFormData = {
    name: '',
    price: '',
    description: '',
    image_urls: [], // Sẽ lưu các URL ảnh (cả cũ và mới sau khi upload) để submit
    product_id: productId || '',
  };

  const [formData, setFormData] = useState(initialFormData);
  
  // States cho quản lý file ảnh
  const [selectedFiles, setSelectedFiles] = useState([]); // Files mới người dùng chọn (File objects)
  const [imagePreviews, setImagePreviews] = useState([]); // URLs tạm thời để preview file mới (object URLs)
  const [existingImageUrls, setExistingImageUrls] = useState([]); // URLs ảnh đã có (khi edit)
  
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (colorProduct) {
        setFormData({
          name: colorProduct.name || '',
          price: colorProduct.price !== null && colorProduct.price !== undefined ? String(colorProduct.price) : '',
          description: colorProduct.description || '',
          image_urls: colorProduct.image_urls || [], // image_urls này sẽ được cập nhật trước khi submit
          product_id: colorProduct.product_id || productId,
        });
        setExistingImageUrls(colorProduct.image_urls || []);
      } else {
        // Thêm mới
        setFormData({ ...initialFormData, product_id: productId });
        setExistingImageUrls([]);
      }
      // Reset trạng thái file khi modal mở
      setSelectedFiles([]);
      setImagePreviews([]); // Các objectURL cũ đã được revoke ở cleanup
      setErrors({});
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }
    }
  }, [colorProduct, isOpen, productId]);

  // Cleanup Object URLs khi component unmount hoặc imagePreviews thay đổi
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newSelectedFiles = [...selectedFiles];
    const newImagePreviews = [...imagePreviews];
    
    let currentTotalImages = existingImageUrls.length + newSelectedFiles.length;

    for (const file of files) {
      if (currentTotalImages >= MAX_IMAGES) {
        toast.warn(`Bạn chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh.`);
        break; 
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`Tệp "${file.name}" quá lớn (tối đa ${MAX_FILE_SIZE_MB}MB).`);
        continue;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`Tệp "${file.name}" không phải là hình ảnh.`);
        continue;
      }
      newSelectedFiles.push(file);
      newImagePreviews.push(URL.createObjectURL(file));
      currentTotalImages++;
    }
    
    setSelectedFiles(newSelectedFiles);
    setImagePreviews(newImagePreviews);

    // Reset input để có thể chọn lại cùng file nếu lỡ xóa
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
    }
    if (errors.image_urls) {
      setErrors(prev => ({...prev, image_urls: ''}));
    }
  };

  const removeNewImage = (indexToRemove) => {
    URL.revokeObjectURL(imagePreviews[indexToRemove]); // Quan trọng: giải phóng bộ nhớ
    setSelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingImage = (urlToRemove) => {
    setExistingImageUrls(prev => prev.filter(url => url !== urlToRemove));
  };


  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Tên màu không được để trống.';
    if (formData.price.trim() && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Giá phải là một số.';
    } else if (formData.price.trim() && parseFloat(formData.price) < 0) {
      newErrors.price = 'Giá không được âm.';
    }
    
    const totalImageCount = existingImageUrls.length + selectedFiles.length;
    if (totalImageCount > MAX_IMAGES) {
        newErrors.image_urls = `Tối đa ${MAX_IMAGES} ảnh. Hiện tại có ${totalImageCount}.`;
    }
    // Bỏ yêu cầu ít nhất 1 ảnh khi thêm mới nếu không muốn, tùy logic nghiệp vụ
    // if (totalImageCount === 0 && !colorProduct) { // Nếu thêm mới và không có ảnh nào
    //     newErrors.image_urls = 'Cần ít nhất 1 ảnh cho biến thể màu mới.';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsUploading(true);
    let uploadedImageUrls = [];

    try {
      if (selectedFiles.length > 0) {
        uploadedImageUrls = await uploadApiService.uploadMultipleProductImages(selectedFiles);
        // toast.success(`Đã tải lên ${uploadedImageUrls.length} ảnh mới!`);
      }

      const finalImageUrls = [...existingImageUrls, ...uploadedImageUrls];

      const dataToSubmit = {
        ...formData, // name, description, product_id
        price: formData.price.trim() ? parseFloat(formData.price) : null,
        image_urls: finalImageUrls, // Gửi mảng URL cuối cùng
      };
      onSubmit(dataToSubmit); // Hàm này sẽ gọi API của colorProductApiService để tạo/cập nhật

    } catch (error) {
      console.error("Lỗi khi submit form (upload hoặc lưu biến thể):", error);
      toast.error(error.message || "Đã có lỗi xảy ra khi lưu biến thể màu.");
      // Không reset isUploading ở đây nếu onSubmit thành công và đóng modal
    }
  };
  
  const handleClose = () => {
    // imagePreviews đã được cleanup bởi useEffect.
    // Không cần gọi lại URL.revokeObjectURL ở đây trừ khi muốn chắc chắn hơn.
    setFormData(initialFormData); 
    setExistingImageUrls([]);
    setSelectedFiles([]);
    setImagePreviews([]);
    setErrors({});
    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentTotalImageCount = existingImageUrls.length + selectedFiles.length;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-xl transform transition-transform duration-300 scale-100 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {colorProduct ? 'Sửa Biến Thể Màu' : 'Thêm Biến Thể Màu'}
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <input type="hidden" name="product_id" value={formData.product_id} />

          <div className="mb-4">
            <label htmlFor="colorProductName" className="block text-sm font-medium text-gray-700 mb-1">
              Tên Màu <span className="text-red-500">*</span>
            </label>
            <input
              type="text" id="colorProductName" name="name" value={formData.name} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="VD: Đỏ Pastel, Xanh Navy"
              disabled={isUploading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="colorProductPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Điều chỉnh giá (VNĐ)
            </label>
            <input
              type="number" id="colorProductPrice" name="price" value={formData.price} onChange={handleChange} step="any"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Để trống nếu giá như sản phẩm gốc"
              disabled={isUploading}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="colorProductDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả cho màu này (tùy chọn)
            </label>
            <textarea
              id="colorProductDescription" name="description" value={formData.description} onChange={handleChange} rows="3"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-indigo-500'}`}
              placeholder="Mô tả thêm về màu sắc, chất liệu đặc trưng cho màu này..."
              disabled={isUploading}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ảnh Biến Thể ({currentTotalImageCount}/{MAX_IMAGES})
              <span className="text-xs text-gray-500 ml-1">
                {`(mỗi ảnh < ${MAX_FILE_SIZE_MB}MB)`}
              </span>

            </label>
            <input
              type="file"
              multiple // Cho phép chọn nhiều file
              accept="image/*" // Chỉ chấp nhận file ảnh
              onChange={handleFileChange}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading || currentTotalImageCount >= MAX_IMAGES}
            />
             {currentTotalImageCount >= MAX_IMAGES && (
                <p className="text-orange-600 text-xs mt-1">Đã đạt số lượng ảnh tối đa.</p>
            )}
            {errors.image_urls && <p className="text-red-500 text-xs mt-1">{errors.image_urls}</p>}

            {/* Previews */}
            {(existingImageUrls.length > 0 || imagePreviews.length > 0) && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {/* Existing images */}
                {existingImageUrls.map((url, index) => (
                  <div key={`existing-${index}-${url}`} className="relative group aspect-w-1 aspect-h-1">
                    <img 
                        src={url} 
                        alt={`Ảnh hiện tại ${index + 1}`} 
                        className="w-full h-full object-cover rounded-md border border-gray-300" 
                        onError={(e) => { e.target.style.display='none'; /* Hoặc thay bằng placeholder */ }}
                    />
                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition-opacity focus:outline-none shadow-md"
                        title="Xóa ảnh này"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                {/* New image previews */}
                {imagePreviews.map((previewUrl, index) => (
                  <div key={`new-${index}-${selectedFiles[index]?.name || index}`} className="relative group aspect-w-1 aspect-h-1">
                    <img src={previewUrl} alt={`Ảnh mới ${index + 1}`} className="w-full h-full object-cover rounded-md border border-blue-300" />
                     {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs opacity-80 group-hover:opacity-100 transition-opacity focus:outline-none shadow-md"
                        title="Bỏ chọn ảnh này"
                      >
                        <FaTimes />
                      </button>
                     )}
                  </div>
                ))}
                 {/* Placeholder for adding more images if not maxed out */}
                {currentTotalImageCount < MAX_IMAGES && !isUploading && (
                    <label 
                        htmlFor="file-upload-trigger"
                        className="aspect-w-1 aspect-h-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-indigo-500 transition-colors"
                    >
                        <FaPlus className="text-gray-400 text-2xl mb-1" />
                        <span className="text-xs text-gray-500">Thêm ảnh</span>
                        <input id="file-upload-trigger" type="file" multiple accept="image/*" onChange={handleFileChange} className="sr-only" ref={fileInputRef} />
                    </label>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-4 border-t">
            <button 
                type="button" 
                onClick={handleClose} 
                disabled={isUploading}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-60"
            >Hủy</button>
            <button 
                type="submit" 
                disabled={isUploading || (currentTotalImageCount === 0 && !colorProduct && !selectedFiles.length)} // Vẫn cho phép submit nếu đang edit và xóa hết ảnh (nếu logic cho phép)
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center disabled:opacity-60"
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" /> Đang xử lý...
                </>
              ) : (
                colorProduct ? 'Lưu thay đổi' : 'Thêm Biến Thể'
              )}
            </button>
          </div>
           {isUploading && <p className="text-sm text-indigo-500 mt-3 text-center">Đang tải ảnh và lưu dữ liệu, vui lòng không đóng cửa sổ...</p>}
        </form>
      </div>
    </div>
  );
}

export default ColorProductModal;