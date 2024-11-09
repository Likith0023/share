// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../firebase';
// import { getDoc, doc } from 'firebase/firestore';

// const DownloadPage = () => {
//   const { fileId } = useParams();
//   const [pin, setPin] = useState('');
//   const [error, setError] = useState(null);
//   const [fileUrl, setFileUrl] = useState(null);

//   const handlePinChange = (e) => {
//     setPin(e.target.value);
//   };

//   const handleDownload = async () => {
//     try {
//       const fileDoc = await getDoc(doc(db, 'fileShares', fileId));
//       if (!fileDoc.exists()) {
//         setError('Invalid download link.');
//         return;
//       }

//       const fileData = fileDoc.data();
//       if (fileData.pin !== pin) {
//         setError('Invalid PIN.');
//         return;
//       }

//       setFileUrl(fileData.fileUrl);
//     } catch (error) {
//       setError('Error verifying PIN.');
//       console.error('Error verifying PIN:', error);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-8">
//       <h2 className="text-xl font-semibold mb-4">Enter PIN to Download File</h2>
//       {error && <p className="text-red-500 mb-4">Error: {error}</p>}
//       {!fileUrl ? (
//         <>
//           <input
//             type="text"
//             className="px-2 py-1 border rounded-md w-full mb-4"
//             placeholder="Enter PIN"
//             value={pin}
//             onChange={handlePinChange}
//           />
//           <button onClick={handleDownload} className="bg-green-500 text-white px-2 py-1 rounded-md w-full">
//             Download
//           </button>
//         </>
//       ) : (
//         <a href={fileUrl} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
//           Click here to download your file
//         </a>
//       )}
//     </div>
//   );
// };

// export default DownloadPage;
