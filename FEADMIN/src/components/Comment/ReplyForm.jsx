// src/components/admin/ReplyForm.jsx
import React, { useState } from 'react';
import { IoSend } from 'react-icons/io5';

function ReplyForm({ onSubmit, isSubmitting }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent(''); // Reset form sau khi gửi
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex items-center space-x-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
        placeholder="Nhập trả lời của bạn..."
        disabled={isSubmitting}
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out disabled:bg-indigo-300 disabled:cursor-not-allowed"
      >
        <IoSend />
        <span className="ml-2 hidden sm:inline">{isSubmitting ? 'Đang gửi...' : 'Gửi'}</span>
      </button>
    </form>
  );
}

export default ReplyForm;