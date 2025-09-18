import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const AccountInfo = () => {
    const { user, token } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateMessage, setUpdateMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user && user.id && token) {
            const fetchProfileData = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const response = await axios.get(`https://benodejs-9.onrender.com/api/customers/${user.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.data.success) {
                        setProfileData(response.data.data);
                        setFormData(response.data.data);
                    } else {
                        setError('Không thể lấy dữ liệu người dùng.');
                    }
                } catch (err) {
                    setError(err.response?.data?.message || 'Đã xảy ra lỗi khi kết nối tới server.');
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProfileData();
        } else {
            setIsLoading(false);
            setError("Vui lòng đăng nhập để xem thông tin.");
        }
    }, [user, token]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdateSubmit = async () => {
        if (!user || !token) return;
        setIsUpdating(true);
        setUpdateMessage({ type: '', text: '' });
        try {
            const response = await axios.put(
                `https://benodejs-9.onrender.com/api/customers/${user.id}`,
                formData,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.data.success) {
                setProfileData(response.data.data);
                setUpdateMessage({ type: 'success', text: response.data.message });
                setIsEditing(false);
            } else {
                setUpdateMessage({ type: 'error', text: response.data.message || 'Cập nhật thất bại.' });
            }
        } catch (err) {
            setUpdateMessage({ type: 'error', text: err.response?.data?.message || 'Lỗi server, vui lòng thử lại.' });
        } finally {
            setIsUpdating(false);
        }
    };
    
    const handleCancelEdit = () => {
        setFormData(profileData);
        setIsEditing(false);
        setUpdateMessage({ type: '', text: '' });
    };

    if (isLoading) return <div className="bg-white rounded-lg shadow p-6 text-center">Đang tải thông tin...</div>;
    if (error) return <div className="bg-white rounded-lg shadow p-6 text-center text-red-500">Lỗi: {error}</div>;
    if (!profileData) return <div className="bg-white rounded-lg shadow p-6 text-center">Không có dữ liệu để hiển thị.</div>;

    const inputClass = "w-full p-2 border border-gray-300 rounded-md md:col-span-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin tài khoản</h2>
            
            {/* ---- FORM HIỂN THỊ VÀ CHỈNH SỬA ---- */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <span className="text-gray-600 font-medium">Họ và tên</span>
                    {isEditing ? (
                        <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={inputClass} />
                    ) : (
                        <span className="md:col-span-2 text-gray-800">{profileData.name}</span>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <span className="text-gray-600 font-medium">Số điện thoại</span>
                    {isEditing ? (
                         <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className={inputClass} />
                    ) : (
                        <span className="md:col-span-2 text-gray-800">{profileData.phone}</span>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <span className="text-gray-600 font-medium">Địa chỉ</span>
                     {isEditing ? (
                         <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className={inputClass} />
                    ) : (
                        <span className="md:col-span-2 text-gray-800">{profileData.address ?? 'Chưa cập nhật'}</span>
                    )}
                </div>
            </div>
            
            {updateMessage.text && (
                <div className={`mt-4 text-sm ${updateMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {updateMessage.text}
                </div>
            )}

            <div className="mt-6 flex items-center space-x-4">
                {isEditing ? (
                    <>
                        <button onClick={handleUpdateSubmit} disabled={isUpdating} className="bg-black text-white font-semibold py-2 px-6 rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:bg-gray-400">
                            {isUpdating ? 'Đang lưu...' : 'LƯU THAY ĐỔI'}
                        </button>
                        <button onClick={handleCancelEdit} className="border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                            HỦY
                        </button>
                    </>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        CẬP NHẬT
                    </button>
                )}
            </div>

            <hr className="my-8" />
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin đăng nhập</h2>
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <span className="text-gray-600 font-medium">Email</span>
                    <span className="md:col-span-2 text-gray-800">{profileData.email}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <span className="text-gray-600 font-medium">Username</span>
                    <span className="md:col-span-2 text-gray-800">{profileData.username}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                    <span className="text-gray-600 font-medium">Mật khẩu</span>
                    <span className="md:col-span-2 text-gray-800">************</span>
                </div>
            </div>
            <div className="mt-6">
                <button className="border border-gray-300 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    ĐỔI MẬT KHẨU
                </button>
            </div>
        </div>
    );
};

export default AccountInfo;