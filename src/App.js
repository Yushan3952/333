// App.js
import React, { useEffect, useState } from 'react';
import './index.css';
import {
  collection,
  getDocs,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from './firebase';

function App() {
  const [images, setImages] = useState([]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');

  const correctPassword = 'winnie3952';

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'images'));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setImages(data);
    } catch (err) {
      console.error('讀取失敗', err);
      setMessage('讀取圖片資料失敗');
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchImages();
    }
  }, [loggedIn]);

  const handleDelete = async (id, public_id) => {
    try {
      const res = await fetch('https://trashmap-api.vercel.app/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ public_id })
      });

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.error || 'Cloudinary 刪除失敗');
      }

      await deleteDoc(doc(db, 'images', id));
      setImages(images.filter((img) => img.id !== id));
      setMessage('圖片刪除成功');
    } catch (err) {
      console.error('刪除失敗：', err);
      setMessage(`刪除失敗：${err.message}`);
    }
  };

  if (!loggedIn) {
    return (
      <div className="login">
        <h2>管理登入</h2>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          /> 顯示密碼
        </label>
        <button onClick={() => setLoggedIn(password === correctPassword)}>
          登入
        </button>
        {password && password !== correctPassword && (
          <p className="error">密碼錯誤</p>
        )}
      </div>
    );
  }

  return (
    <div className="app">
      <h1>TrashMap 圖片管理</h1>
      {message && <p className="message">{message}</p>}
      {images.length === 0 ? (
        <p>讀取中或無資料</p>
      ) : (
        <ul>
          {images.map((img) => (
            <li key={img.id}>
              <img src={img.url} alt="uploaded" />
              <button onClick={() => handleDelete(img.id, img.public_id)}>
                刪除
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
