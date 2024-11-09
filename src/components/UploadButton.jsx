import React from 'react';

const UploadButton = ({ onUpload }) => {
  return (
    <button
      onClick={onUpload}
      className="w-full max-w-xs bg-yellow-500 text-white py-2 px-4 rounded-md bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 hover:text-white hover:shadow-lg transition-all duration-300"
    >
      Upload
    </button>
  );
};

export default UploadButton;
