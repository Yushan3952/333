export default function handler(req, res) {
  const points = [
    { id: 1, lat: 23.7, lng: 120.9, type: "塑膠", description: "河岸有垃圾" },
    { id: 2, lat: 23.6, lng: 120.95, type: "寶特瓶", description: "漂浮在水面" }
  ];

  res.status(200).json(points);
}
