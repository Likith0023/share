import React, { useState, useEffect } from 'react';
import { storage } from '../firebase';
import { ref, listAll, getDownloadURL, deleteObject } from 'firebase/storage';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

const functions = getFunctions();
connectFunctionsEmulator(functions, '127.0.0.1', 5001);

const sendEmail = httpsCallable(functions, 'sendEmail');

const FilesComponent = ({ user }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ message: '', show: false });
  const [emailStates, setEmailStates] = useState({});

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user) return;

      const listRef = ref(storage, `uploads/${user.uid}`);
      try {
        const res = await listAll(listRef);
        const filesList = await Promise.all(res.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          return { name: itemRef.name, url, ref: itemRef };
        }));
        setFiles(filesList);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching files', error);
      }
    };

    fetchFiles();
  }, [user]);

  const handleShareEmail = async (url, fileIndex) => {
    let email = emailStates[fileIndex];
    if (!email) {
      setError('Please enter an email address.');
      return;
    }

    email = email.trim();

    try {
      await sendEmail({ toEmail: email, fileUrl: url });
      setNotification({ message: 'Email sent successfully!', show: true });
      setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 2000); 
    } catch (error) {
      console.error('Error sending Email:', error);
      setError('Error sending Email. Please try again later.');
    }
  };

  const handleDelete = async (fileRef) => {
    try {
      await deleteObject(fileRef);
      setFiles(files.filter(file => file.ref !== fileRef));
      setNotification({ message: 'File deleted successfully!', show: true });
      setTimeout(() => {
        setNotification({ ...notification, show: false });
      }, 2000); // Hide notification after 2 seconds
    } catch (error) {
      console.error('Error deleting file:', error);
      setError('Error deleting file. Please try again later.');
    }
  };

  const handleEmailChange = (event, index) => {
    const newEmailStates = { ...emailStates, [index]: event.target.value };
    setEmailStates(newEmailStates);
  };

  const handleDownload = (file) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="max-w-lg mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Files</h2>
      {error && <p className="text-red-500 mb-4">Error: {error}</p>}
      {notification.show && (
        <p className="text-green-500 mb-4">{notification.message}</p>
      )}
      {files.length === 0 ? (
        <p className="text-red-500">No files uploaded</p>
      ) : (
        <ul>
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center w-full">
                <button
                  onClick={() => handleDownload(file)}
                  className="text-blue-500 hover:underline"
                >
                  {file.name}
                </button>
                <input
                  type="email"
                  className="ml-4 px-2 py-1 border rounded-md w-1/2"
                  placeholder="Enter email address"
                  onChange={(event) => handleEmailChange(event, index)}
                />
                <button
                  onClick={() => handleShareEmail(file.url, index)}
                  className="ml-2 bg-blue-500 text-white px-2 py-1 rounded-md"
                >
                  Share
                </button>
                <button
                  onClick={() => handleDelete(file.ref)}
                  className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FilesComponent;
