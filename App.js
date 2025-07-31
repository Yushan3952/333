import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

// ✅ 你的 Firebase 設定
const firebaseConfig = {
  apiKey: "AiX-tc-Rlr08KU8tPYZ4QcXDFdAx3LYHI",
  authDomain: "trashmap-d648e.firebaseapp.com",
  projectId: "trashmap-d648e",
  storageBucket: "trashmap-d648e.appspot.com",
  messagingSenderId: "527164483024",
  appId: "1:527164483024:web:a40043feb0e05672c085d5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 讀取資料
  async function fetchData() {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "garbage"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDataList(list);
    } catch (err) {
      alert("讀取失敗：" + err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 刪除 Cloudinary + Firestore
  async function handleDelete(item) {
    const confirmed = window.confirm("確定要刪除這筆資料嗎？");
    if (!confirmed) return;

    try {
      // ✅ 呼叫你的 Cloudinary 刪除 API（請改成你部署的網址）
      const res = await fetch("https://https://trashmap-background.vercel.app//delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: item.public_id }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Cloudinary 刪除失敗");

      // ✅ 再刪除 Firestore 文件
      await deleteDoc(doc(db, "garbage", item.id));
      alert("刪除成功");
      fetchData();
    } catch (err) {
      alert("刪除失敗：" + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>TrashMap 管理後台</h1>

      {loading ? (
        <p>讀取中...</p>
      ) : dataList.length === 0 ? (
        <p>目前沒有資料</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>圖片</th>
              <th>時間</th>
              <th>位置</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.imageUrl}
                    alt="垃圾照"
                    style={{ width: 120, height: 80, objectFit: "cover" }}
                  />
                </td>
                <td>
                  {item.timestamp?.seconds
                    ? new Date(item.timestamp.seconds * 1000).toLocaleString()
                    : "無時間"}
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
