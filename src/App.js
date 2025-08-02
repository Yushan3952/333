import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import "./index.css";

// ✅ Firebase 設定
const firebaseConfig = {
  apiKey: "AIzaSyAeX-tc-Rlr08KU8tPYZ4QcXDFdAx3LYHI",
  authDomain: "trashmap-d648e.firebaseapp.com",
  projectId: "trashmap-d648e",
  storageBucket: "trashmap-d648e.appspot.com",
  messagingSenderId: "527164483024",
  appId: "1:527164483024:web:a3203461b112e085c085d5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ 一進來就抓資料
  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const colRef = collection(db, "images"); // ← 如果你是用別的名稱請改這
      const snapshot = await getDocs(colRef);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("抓到資料：", list);
      setDataList(list);
    } catch (error) {
      console.error("讀取失敗：", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id, publicId) => {
    const confirmDelete = window.confirm("確定要刪除這張圖片？");
    if (!confirmDelete) return;

    try {
      const response = await fetch("https://trashmap-api.vercel.app/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: publicId }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "刪除失敗");
      }

      await deleteDoc(doc(db, "images", id)); // ← 如果你是用別的名稱請改這
      setDataList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert("刪除失敗：" + err.message);
      console.error(err);
    }
  };

  const handleLogin = () => {
    if (password === "winnie3952") {
      setIsAuthenticated(true);
    } else {
      alert("密碼錯誤");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="login">
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
            onChange={() => setShowPassword(!showPassword)}
          />
          顯示密碼
        </label>
        <button onClick={handleLogin}>登入</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>TrashMap 後台管理</h1>
      {loading ? (
        <p>讀取中...</p>
      ) : (
        <ul className="card-list">
          {dataList.map((item) => (
            <li key={item.id} className="card">
              <img src={item.url} alt="垃圾照片" />
              <p>經緯度：{item.lat}, {item.lng}</p>
              <p>時間：{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</p>
              <button onClick={() => handleDelete(item.id, item.publicId)}>
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
