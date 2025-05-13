import React from 'react';

const BlogNavigation = () => {
  return (
    <nav className="py-4 sm:py-6 mb-6 sm:mb-8 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex space-x-3 sm:space-x-6">
          <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
            Mặc đẹp <span className="ml-1 text-xs">▼</span>
          </button>
          <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
            Sống Chất <span className="ml-1 text-xs">▼</span>
          </button>
          <button className="text-gray-700 hover:text-blue-600 font-medium">
            Coolmate có gì mới?
          </button>
        </div>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>
    </nav>
  );
};

export default BlogNavigation;