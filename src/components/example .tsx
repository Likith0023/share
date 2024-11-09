// import classNames from 'classnames';
// import styles from './product-details-page.module.scss';
// import { useParams } from 'react-router-dom';
// import { RouteParams } from '../../router/config';
// import commonStyles from '../../styles/common-styles.module.scss';
// import { ProductImages } from './product-images/product-images';
// import { ProductInfo } from './product-info/product-info';
// import { useAddToCart, useProduct } from '../../api/api-hooks';
// import { useContext, useRef, useState } from 'react';
// import { CartOpenContext } from '../../components/cart/cart-open-context';

// export interface ProductDetailsPageProps {
//     className?: string;
// }

// export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ className }) => {
//     const { setIsOpen } = useContext(CartOpenContext);
//     const { slug: productSlug } = useParams<RouteParams['/product/:slug']>();
//     const { data: product, isLoading } = useProduct(productSlug);
//     const { trigger: addToCart } = useAddToCart();
//     const quantityInput = useRef<HTMLInputElement>(null);
//     const [isRecording, setIsRecording] = useState(false);
//     const [audioURL, setAudioURL] = useState('');
//     const [transcription, setTranscription] = useState('');
//     const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//     const audioChunksRef = useRef<BlobPart[]>([]);

//     if (!product) {
//         return (
//             <div className={commonStyles.loading}>
//                 {isLoading ? 'Loading...' : 'The product is not found'}
//             </div>
//         );
//     }

//     async function addToCartHandler() {
//         if (!product?._id) {
//             return;
//         }

//         const quantity = parseInt(quantityInput.current?.value || '1', 10);
//         await addToCart({ id: product._id, quantity });
//         setIsOpen(true);
//     }

//     const handleStartRecording = () => {
//         navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
//             const mediaRecorder = new MediaRecorder(stream);
//             mediaRecorderRef.current = mediaRecorder;
//             audioChunksRef.current = [];
//             mediaRecorder.start();
//             setIsRecording(true);

//             mediaRecorder.ondataavailable = (event) => {
//                 audioChunksRef.current.push(event.data);
//             };

//             mediaRecorder.onstop = async () => {
//                 const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//                 const audioUrl = URL.createObjectURL(audioBlob);
//                 setAudioURL(audioUrl);

//                 const formData = new FormData();
//                 formData.append('audio', audioBlob, 'audio.wav');
//                 formData.append('product_data', JSON.stringify({
//                     name: product.name || 'Dummy Product Name',
//                     description: product.description || 'Dummy product description',
//                     brand: 'Dummy Brand',
//                     price: product.price?.formatted?.price || '99.99',
//                     discountedPrice: '79.99',
//                     currency: 'USD',
//                     stock: '100',
//                     InStock: true,
//                     ribbon: 'New Arrival',
//                     productOptions: [{ name: "Size", choices: ['S', 'M', 'L'] }]
//                 }));
//                 formData.append('reviews_data', JSON.stringify({
//                     items: [{
//                         title: 'Great product!',
//                         rating: '5',
//                         content: 'I really loved this product.'
//                     }]
//                 }));
//                 formData.append('average_rating', '4.5');
//                 formData.append('summary', 'Summary of the product');

//                 const response = await fetch('http://localhost:3000/process_audio_returning_user', {
//                     method: 'POST',
//                     body: formData
//                 });

//                 const result = await response.json();
//                 setTranscription(result.transcription_answer);

//                 if (result.file_content) {
//                     const byteCharacters = atob(result.file_content);
//                     const byteNumbers = new Uint8Array(byteCharacters.length);
//                     for (let i = 0; i < byteCharacters.length; i++) {
//                         byteNumbers[i] = byteCharacters.charCodeAt(i);
//                     }
//                     const audioBlob = new Blob([byteNumbers], { type: 'audio/wav' });
//                     const base64AudioURL = URL.createObjectURL(audioBlob);
//                     setAudioURL(base64AudioURL);
//                 }
//             };
//         });
//     };

//     const handleStopRecording = () => {
//         if (mediaRecorderRef.current) {
//             mediaRecorderRef.current.stop();
//             setIsRecording(false);
//         }
//     };

//     return (
//         <div className={classNames(styles.root, className)}>
//             <div className={classNames(styles.left)}>
//     <ProductImages
//         mainImage={product.media?.mainMedia}
//         images={product.media?.items}
//         className={styles.images}
//     />
//     <div className={classNames(styles.audioRecorder)}>
//         <h2>Talk to Product</h2>
//         <p>To know more, record audio about the product.</p>
//         <button onClick={handleStartRecording} disabled={isRecording}>
//             Start Recording
//         </button>
//         <button onClick={handleStopRecording} disabled={!isRecording}>
//             Stop Recording
//         </button>
//         {audioURL && <audio controls src={audioURL} />}
//         {transcription && (
//             <div className={styles.transcription}>
//                 Transcription: {transcription}
//             </div>
//         )}
//     </div>
// </div>

//             <div className={styles.right}>
//                 <div className={styles.heading}>{product.name}</div>
//                 {product.price && (
//                     <div className={commonStyles.price}>{product.price?.formatted?.price}</div>
//                 )}
//                 <div className={styles.addToCart}>
//                     <label className={styles.label}>
//                         Quantity:
//                         <input
//                             ref={quantityInput}
//                             className={classNames(commonStyles.numberInput, styles.quantity)}
//                             type="number"
//                             min={1}
//                             placeholder="1"
//                         />
//                     </label>
//                     <button
//                         onClick={addToCartHandler}
//                         className={classNames(commonStyles.primaryButton, styles.addToCartBtn)}
//                     >
//                         Add to Cart
//                     </button>
//                 </div>
//                 <ProductInfo
//                     className={styles.productInfo}
//                     productInfo={product.additionalInfoSections}
//                     description={product.description}
//                 />
//             </div>
//         </div>
//     );
    
// }
    
// };