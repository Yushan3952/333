import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

// ✅ Firebase 設定（已替換成你提供的）
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

export default function App() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  const correctPassword = "winnie3952";

  async function fetchData() {
    setLoading(true);
    const colRef = collection(db, "garbage");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDataList(list);
    setLoading(false);
  }

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  async function handleDelete(item) {
    if (!window.confirm("確定要刪除這筆資料嗎？")) return;

    try {
      const res = await fetch("https://trashmap-api.vercel.app/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: item.public_id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "刪除圖片失敗");

      await deleteDoc(doc(db, "garbage", item.id));
      alert("刪除成功");
      fetchData();
    } catch (err) {
      alert("刪除失敗：" + err.message);
    }
  }

  if (!authenticated) {
    return (
      <div style={{ maxWidth: 400, margin: "100px auto", textAlign: "center" }}>
        <h2>請輸入密碼</h2>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="輸入密碼"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: 10, width: "80%" }}
        />
        <div style={{ marginTop: 10 }}>
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />{" "}
            顯示密碼
          </label>
        </div>
        <button
          style={{ marginTop: 20, padding: "8px 20px" }}
          onClick={() => {
            if (password === correctPassword) {
              setAuthenticated(true);
            } else {
              alert("密碼錯誤");
            }
          }}
        >
          登入
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>TrashMap 管理後台</h1>
      {loading && <p>讀取中...</p>}
      {!loading && dataList.length === 0 && <p>目前沒有任何資料</p>}

      {!loading && dataList.length > 0 && (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>圖片</th>
              <th>上傳時間</th>
              <th>上傳位置</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imageUrl}
                    alt="垃圾照片"
                    style={{ width: 120, height: 80, objectFit: "cover" }}
                  />
                </td>
                <td>
                  {item.timestamp?.seconds
                    ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                    : "無資料"}
                </td>
                <td>
                  {item.location?.lat?.toFixed(5)},{" "}
                  {item.location?.lng?.toFixed(5)}
                </td>
                <td>
                  <button onClick={() => handleDelete(item)}>刪除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

