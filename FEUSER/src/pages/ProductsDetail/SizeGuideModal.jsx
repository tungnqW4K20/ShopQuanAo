import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Sample Data (Replace with actual data passed via props or fetched)
const sizeChartData = {
  headers: ["Size", "Chiều cao", "Cân nặng", "Dài áo (Thân trước)", "Dài áo (Thân sau)", "Dài tay", "Rộng ngực (Nách cách 2cm)", "Rộng vai", "Rộng gập tay"],
  sizes: [
    { size: "S", values: ["1m55 - 1m59", "48kg - 54kg", 64, 66, 21, 48, 40.5, 18.5] },
    { size: "M", values: ["1m60 - 1m64", "55kg - 60kg", 66, 68, 21.5, 50, 42, 18.5] },
    { size: "L", values: ["1m65 - 1m72", "61kg - 68kg", 68, 70, 22, 52, 43.5, 19.5] },
    { size: "XL", values: ["1m72 - 1m77", "69kg - 76kg", 70, 72, 22.5, 54, 45, 19.5] },
    { size: "2XL", values: ["1m77 - 1m83", "76kg - 82kg", 72, 74, 23.5, 56, 46.5, 21] },
    { size: "3XL", values: ["1m83 - ...", "83kg - 87kg", 74, 76, 24.5, 58, 48, 21] },
    { size: "4XL", values: ["...", "87kg - 92kg", 76, 78, 25.5, 60, 49.5, 22] }, // Added sample 4XL
  ]
};

// --- Tab Content Components (or inline JSX) ---

const GuideTabContent = () => {
  const [height, setHeight] = useState(170); // Default cm
  const [weight, setWeight] = useState(65); // Default kg

  return (
    <div className="px-6 py-4">
       {/* Sliders */}
       <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
              <label htmlFor="height-slider" className="text-sm font-medium text-gray-700">Chiều cao</label>
              <span className="text-sm font-semibold text-blue-600">{height}cm</span>
          </div>
          <input
              id="height-slider"
              type="range"
              min="145"
              max="200"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
           <div className="flex items-center justify-between">
              <label htmlFor="weight-slider" className="text-sm font-medium text-gray-700">Cân Nặng</label>
              <span className="text-sm font-semibold text-blue-600">{weight}kg</span>
          </div>
          <input
              id="weight-slider"
              type="range"
              min="40"
              max="120"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
       </div>

        {/* Body Type Images */}
        <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
                <img src="https://media.ngoisao.vn/news/2012/12/23/49/tiendoanjpg1356251456.jpg" alt="Gầy" className="w-full object-contain mb-2 rounded"/>
                <p className="text-sm font-semibold text-gray-800">Gầy</p>
            </div>
             <div>
                <img src="https://photo.znews.vn/w660/Uploaded/wopthuo/2016_11_27/10.jpg" alt="Bình thường" className="w-full object-contain mb-2 rounded"/>
                <p className="text-sm font-semibold text-gray-800">Bình thường</p>
            </div>
             <div>
                <img src="https://media.istockphoto.com/id/1358314088/vi/anh/ch%C3%A2n-dung-studio-c%E1%BB%A7a-m%E1%BB%99t-ch%C3%A0ng-trai-tr%E1%BA%BB-c%C6%A1-b%E1%BA%AFp-t%E1%BA%A1o-d%C3%A1ng-v%E1%BB%9Bi-c%C3%A1nh-tay-khoanh-l%E1%BA%A1i-tr%C3%AAn-n%E1%BB%81n-m%C3%A0u-x%C3%A1m.jpg?s=612x612&w=0&k=20&c=QaXEMdlnL30yeSZy4lP06Cy74pcHbbH1v9aUd36GiI8=" alt="Đầy đặn" className="w-full object-contain mb-2 rounded"/>
                <p className="text-sm font-semibold text-gray-800">Đầy đặn</p>
            </div>
        </div>

        {/* Suggestion Text */}
        <p className="text-sm text-gray-600 text-center">
            <span className="font-semibold">Coolmate gợi ý bạn:</span><br/>
            Hãy chọn thêm hình dáng cơ thể bên trên để Coolmate gợi ý cho bạn tốt hơn nhé!
        </p>
    </div>
  );
};

const TableTabContent = () => {
  return (
    <div className="px-6 py-4">
       <div className="overflow-x-auto mb-6">
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200 text-sm">
                <thead className="bg-gray-50">
                    <tr>
                        {sizeChartData.headers.map((header) => (
                            <th key={header} scope="col" className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap border-l border-gray-200 first:border-l-0">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sizeChartData.sizes.map((row) => (
                        <tr key={row.size}>
                            <td className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 border-l border-gray-200 first:border-l-0">{row.size}</td>
                             {row.values.map((value, idx) => (
                                <td key={idx} className="px-3 py-2 whitespace-nowrap text-gray-700 border-l border-gray-200">{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* Diagram & Explanation */}
        <div className="md:flex md:items-start md:gap-6">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:w-1/3">
                {/* Replace with your actual diagram image */}
                <img src="https://media3.coolmate.me/cdn-cgi/image/width=1069,height=1575,quality=80,format=auto/uploads/December2023/Polo_cottonGroup_1255.jpg" alt="Size Chart Diagram" className="w-full max-w-[200px] mx-auto object-contain rounded"/>
            </div>
            <div className="text-xs text-gray-600 space-y-1 flex-grow">
                <p><span className='font-semibold'>A. Dài áo:</span> Đo từ điểm cao nhất của vai xuống vạt áo.</p>
                <p><span className='font-semibold'>B. Dài tay:</span> Đo từ đỉnh vai đến hết bo tay.</p>
                <p><span className='font-semibold'>C. Rộng vai:</span> Đo từ điểm may vai bên này qua điểm may vai bên kia.</p>
                <p><span className='font-semibold'>D. Rộng ngực:</span> Đo từ điểm cách nách 2cm bên này qua bên kia.</p>
                 <p className='mt-4 italic'>
                    Tương hợp với số đo của bạn nên trong khoảng giữa các size với nhau: <br/>
                    Với số đo bạn hãy lựa chọn ưu tiên theo chiều cao.<br/>
                    VD: Bạn cao 1m65 nặng 70kg theo bảng size sẽ lựa chọn theo size M/ Hãy chọn L.<br/>
                    Với khách hàng lựa chọn bột sát chọn đúng size theo cách này.
                 </p>
            </div>
        </div>
    </div>
  );
};

// --- Main Modal Component ---
const SizeGuideModal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('guide'); // 'guide' or 'table'

  return (
    // Overlay
    <div
        className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300"
        onClick={onClose} // Close on overlay click
    >
      {/* Modal Panel */}
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden transition-transform duration-300 transform scale-95 opacity-0 animate-modal-scale-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Hướng dẫn chọn size Áo Polo Nam Pique Cotton</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded-full hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex-1 py-3 px-4 text-center text-sm font-medium focus:outline-none ${
              activeTab === 'guide'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Hướng dẫn chọn size
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex-1 py-3 px-4 text-center text-sm font-medium focus:outline-none ${
              activeTab === 'table'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Bảng size
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-grow">
          {activeTab === 'guide' && <GuideTabContent />}
          {activeTab === 'table' && <TableTabContent />}
        </div>
      </div>
       {/* Add keyframes for animation in your global CSS or index.css */}
       <style jsx global>{`
          @keyframes modal-scale-in {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .animate-modal-scale-in {
            animation: modal-scale-in 0.2s ease-out forwards;
          }
        `}</style>
    </div>
  );
};

export default SizeGuideModal; 

// Add this to your global CSS (e.g., index.css or App.css) if not using style jsx:
/*
@keyframes modal-scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-modal-scale-in {
  animation: modal-scale-in 0.2s ease-out forwards;
}
*/