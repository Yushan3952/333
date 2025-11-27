const map = L.map('map').setView([23.8, 120.97], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

const PASSWORD = "winnie3952"; // 對應後端 ADMIN_PASSWORD

async function loadPoints() {
  try {
    const res = await fetch('https://trashmap-background.vercel.app/api/points', {
      method: 'GET',
      headers: { 'x-password': PASSWORD }
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "讀取失敗");

    data.points.forEach(p => {
      L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(`<b>ID:</b>${p.id}<br><b>Note:</b>${p.note || ''}<br>
                    <button onclick="deletePoint('${p.id}')">刪除</button>`);
    });
  } catch (err) {
    alert("無法讀取後端資料: " + err.message);
  }
}

async function deletePoint(id) {
  if (!confirm("確定要刪除這個垃圾點嗎？")) return;

  try {
    const res = await fetch('https://trashmap-background.vercel.app/api/delete', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-password': PASSWORD
      },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      alert("刪除成功");
      location.reload();
    } else {
      alert("刪除失敗: " + data.message);
    }
  } catch (err) {
    alert("刪除錯誤: " + err.message);
  }
}

loadPoints();
