import React from 'react';

const FileUpload = ({ onFileChange, fileInputRef }) => {
  return (
    <div className="w-full flex justify-center bg-green-500">
      <input
        type="file"
        onChange={(e) => onFileChange(e.target.files[0])}
        className="mb-4 bg-green-800"
        ref={fileInputRef}
      />
    </div>
  );
};

export default FileUpload;
