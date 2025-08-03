import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import './App.css';
import './index.css';
import './firebase'; // 確保已初始化 Firebase

const PASSWORD = 'winnie3952';

function App() {
  const [images, setImages] = useState([]);
  const [password, setPassword] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const db = getFirestore();
  const imagesCollection = collection(db, 'images');

  const fetchImages = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(imagesCollection);
      const fetchedImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(fetchedImages);
    } catch (error) {
      console.error('讀取失敗：', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authorized) fetchImages();
  }, [authorized]);

  const handleDelete = async (id, public_id) => {
    const confirmDelete = window.confirm('確定要刪除這張圖片？');
    if (!confirmDelete) return;

    console.log('🧪 準備刪除圖片：', { id, public_id }); // <--- 加入除錯資訊

    try {
      const response = await fetch('https://222-nu-one.vercel.app/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id }),
      });

      const result = await response.json();
      console.log('✅ Cloudinary 回應：', result); // <--- 回應除錯

      if (!response.ok) {
        throw new Error(result.error || 'Cloudinary 刪除失敗');
      }

      await deleteDoc(doc(db, 'images', id));
      alert('✅ 刪除成功');
      fetchImages();
    } catch (error) {
      console.error('❌ 刪除失敗：', error);
      alert(`刪除失敗：${error.message}`);
    }
  };

  const handleLogin = () => {
    if (password === PASSWORD) {
      setAuthorized(true);
    } else {
      alert('密碼錯誤');
    }
  };

  if (!authorized) {
    return (
      <div className="login-container">
        <h2>管理員登入</h2>
        <input
          type={showPassword ? 'text' : 'password'}
          value={password}
          placeholder="輸入密碼"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          顯示密碼
        </label>
        <button onClick={handleLogin}>登入</button>
      </div>
    );
  }

  return (
    <div className="app">
      <h2>🗑️ TrashMap 管理後台</h2>
      {loading ? (
        <p>讀取中...</p>
      ) : images.length === 0 ? (
        <p>目前沒有圖片</p>
      ) : (
        <div className="image-grid">
          {images.map(({ id, imageUrl, public_id }) => (
            <div key={id} className="image-card">
              <img src={imageUrl} alt="Trash" />
              <button onClick={() => handleDelete(id, public_id)}>刪除</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
