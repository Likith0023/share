import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth, storage } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import FileUpload from './components/FileUpload';
import UploadButton from './components/UploadButton';
import FilesComponent from './components/FilesComponent';
import Signup from './components/Signup';
import Login from './components/Login';
import './App.css';

const App = () => {
  const [file, setFile] = useState(null);
  const [downloadURL, setDownloadURL] = useState('');
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleUpload = async () => {
    if (!file || !user) return;

    setProgress(0);
    setUploading(true);
    const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload failed', error);
        setUploading(false);
      },
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        setShowSuccess(true);

        setFile(null);
        setProgress(0);
        setUploading(false);
      }
    );
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setDownloadURL('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <Router>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-green-100"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/36478/amazing-beautiful-beauty-blue.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <h1 className="font-bold text-green text-2xl mb-4">Welcome to PShare</h1>

        <nav className="flex justify-between items-center bg-gray-800 text-white py-4 px-6 w-full max-w-2xl mb-8">
          <Link to="/upload" className="text-white">Upload File</Link>
          <Link to="/files" className="text-white">View Files</Link>
        </nav>

        <div className="w-full max-w-2xl bg-white bg-opacity-75 p-4 rounded-md shadow-md">
          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/upload" element={user ? (
              <div className="mt-8 flex flex-col items-center">
                <h6 className="text-lg mb-4">File Upload</h6>
                <FileUpload onFileChange={handleFileChange} fileInputRef={fileInputRef} />
                <div className="w-full flex justify-center mt-4">
                  <UploadButton onUpload={handleUpload} />
                </div>
                {uploading && progress < 100 && (
                  <div className="w-full max-w-xs bg-gray-200 rounded-full mt-4">
                    <div
                      className="bg-green-500 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                      style={{ width: `${progress}%` }}
                    >
                      {progress.toFixed(2)}%
                    </div>
                  </div>
                )}
                {showSuccess && (
                  <div className="mt-4 text-center">
                    <p className="text-black font-bold">File uploaded successfully!</p>
                    <a href={downloadURL} target="_blank" rel="noopener noreferrer" className="text-dark-blue-500 hover:underline">Download Link</a>
                  </div>
                )}
              </div>
            ) : <Navigate to="/signup" />} />
            <Route path="/files" element={user ? <FilesComponent user={user} /> : <Navigate to="/signup" />} />
            <Route path="*" element={<Navigate to="/signup" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
