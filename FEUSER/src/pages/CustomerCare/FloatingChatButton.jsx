import React from 'react';
// Option 1: Using a simple icon (replace with FaZalo if available or a suitable alternative)
// import { BsChatDots } from 'react-icons/bs';
// Option 2: Using an image
import ZaloIcon from '../assets/zalo-icon.png'; // Make sure you have this image

const FloatingChatButton = () => {
  return (
    <a
      href="#" // Add your Zalo chat link here
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 bg-blue-500 rounded-full p-3 shadow-lg hover:bg-blue-600 transition duration-300"
      aria-label="Chat via Zalo"
    >
      {/* Option 1: Icon */}
      {/* <BsChatDots className="text-white text-2xl" /> */}

      {/* Option 2: Image */}
      <img src={ZaloIcon} alt="Chat Zalo" className="w-8 h-8" />
    </a>
  );
};

export default FloatingChatButton;