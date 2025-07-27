import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const AdminPanel = () => {
  const [images, setImages] = useState([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      fetchData();
    }
  }, [authenticated]);

  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'images'));
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setImages(data);
  };

  const handleDelete = async (id, publicId) => {
    try {
      await axios.post('/api/delete-image', { publicId });
      await deleteDoc(doc(db, 'images', id));
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      alert('刪除失敗');
      console.error(error);
    }
  };

  const handleLogin = () => {
    if (password === 'winnie3952') {
      setAuthenticated(true);
    } else {
      alert('密碼錯誤');
    }
  };

  if (!authenticated) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-2">管理後台登入</h2>
        <input
          type="password"
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2"
        >
          登入
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">垃圾熱點圖片管理</h1>
      {images.map(image => (
        <div key={image.id} className="border p-4 mb-4 rounded">
          <img src={image.url} alt="uploaded" className="w-64 h-auto mb-2" />
          <p><strong>時間：</strong>{image.timestamp}</p>
          <p><strong>位置：</strong>{image.location}</p>
          <button
            onClick={() => handleDelete(image.id, image.publicId)}
            className="bg-red-500 text-white px-4 py-2 mt-2"
          >
            刪除
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;
