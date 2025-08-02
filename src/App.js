import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./index.css";

// ✅ Firebase 設定（請確認為你的設定）
const firebaseConfig = {
  apiKey: "你的API金鑰",
  authDomain: "你的authDomain",
  projectId: "trashmap-d648e",
  storageBucket: "你的storageBucket",
  messagingSenderId: "你的senderId",
  appId: "你的appId",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const App = () => {
  const [images, setImages] = useState([]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const correctPassword = "winnie3952";

  useEffect(() => {
    if (authenticated) {
      fetchImages();
    }
  }, [authenticated]);

  const fetchImages = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "images"));
      const imageData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imageData);
    } catch (error) {
      console.error("載入圖片失敗：", error);
      alert("載入圖片失敗");
    }
  };

  const handleDelete = async (docId, publicId) => {
    const confirmDelete = window.confirm("確定要刪除這張圖片嗎？");

    if (!confirmDelete) return;

    try {
      // ✅ 呼叫 Cloudinary 刪除 API
      const response = await fetch("https://trashmap-api.vercel.app/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Cloudinary 刪除失敗");
      }

      // ✅ 刪除 Firestore 文件
      await deleteDoc(doc(db, "images", docId));
      alert("圖片刪除成功！");
      fetchImages();
    } catch (error) {
      console.error("刪除失敗：", error);
      alert(`刪除失敗：${error.message}`);
    }
  };

  const handleLogin = () => {
    if (password === correctPassword) {
      setAuthenticated(true);
    } else {
      alert("密碼錯誤！");
    }
  };

  if (!authenticated) {
    return (
      <div className="login-container">
        <h2>管理員登入</h2>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword((prev) => !prev)}
          />
          顯示密碼
        </label>
        <button onClick={handleLogin}>登入</button>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>TrashMap 管理後台</h1>
      <div className="image-grid">
        {images.map((img) => (
          <div key={img.id} className="image-card">
            <img src={img.url} alt="uploaded" />
            <button onClick={() => handleDelete(img.id, img.public_id)}>
              刪除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
