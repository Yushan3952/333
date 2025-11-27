// 建立地圖
const map = L.map('map').setView([23.8, 120.97], 8);

// 使用 OpenStreetMap 圖資
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

// 從後端取得資料
async function loadPoints() {
  try {
    const res = await fetch('/api/points');
    const data = await res.json();

    data.forEach(p => {
      L.marker([p.lat, p.lng])
        .addTo(map)
        .bindPopup(`
          <b>垃圾類型：</b> ${p.type}<br>
          <b>描述：</b> ${p.description}<br>
          <b>ID：</b> ${p.id}
        `);
    });

  } catch (err) {
    alert("無法讀取後端資料");
  }
}

loadPoints();
