import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "你的Firebase API Key",
  authDomain: "你的Firebase Auth Domain",
  projectId: "你的Firebase Project ID",
  storageBucket: "你的Firebase Storage Bucket",
  messagingSenderId: "你的Firebase Messaging SenderId",
  appId: "你的Firebase App ID",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function App() {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 抓 Firestore 垃圾資料
  async function fetchData() {
    setLoading(true);
    const colRef = collection(db, "garbage");
    const snapshot = await getDocs(colRef);
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDataList(list);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // 刪除資料：先刪 Cloudinary 圖片，再刪 Firestore
  async function handleDelete(item) {
    if (!window.confirm("確定要刪除這筆資料嗎？")) return;

    try {
      // 1. 呼叫後端 API 刪除 Cloudinary 圖片
      const res = await fetch("https://你的後端網址/delete-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: item.public_id }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "刪除圖片失敗");

      // 2. 刪除 Firestore 文件
      await deleteDoc(doc(db, "garbage", item.id));

      alert("刪除成功");
      fetchData();
    } catch (err) {
      alert("刪除失敗：" + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>TrashMap 管理後台</h1>
      {loading && <p>讀取中...</p>}
      {!loading && dataList.length === 0 && <p>沒有資料</p>}

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
                <td>{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</td>
                <td>
                  {item.location?.lat?.toFixed(5)}, {item.location?.lng?.toFixed(5)}
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
